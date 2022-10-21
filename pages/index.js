import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from '../components/LotteryEntrance'
import Header from "../components/Header"
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our smartcontract lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader/> */}
      <Header/>
      <LotteryEntrance/> 
    </div>
  )
}
