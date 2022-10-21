import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        await updateUI()
    }
    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell"
        })

    }
    const { runContractFunction: enterRaffle,isLoading,isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUI() {
        if (isWeb3Enabled) {
            const entranceFeeFromContract = (await getEntranceFee()).toString()
            console.log("entrance", entranceFeeFromContract)
            setEntranceFee(entranceFeeFromContract)
            setNumPlayers((await getNumberOfPlayers()).toString())
            setRecentWinner((await getRecentWinner()).toString())
            console.log(entranceFee)
        }
    }
    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])
    return (
        <div className="p-5">
            Hi from LotteryEntrance!
            {raffleAddress ?
                <div>
                    <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    disabled={isLoading||isFetching}
                    onClick={async () => {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => { console.log(error) }
                        })
                    }}>
                        {isFetching||isLoading?<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        :<div>EnterRaffle</div>}
                    </button>
                    <div>Entrance Fee : {ethers.utils.formatUnits(entranceFee, "ether")}ETH</div>
                    <div>Number of Players : {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div> :
                <div>No raffle address detected</div>}

        </div>
    )
}