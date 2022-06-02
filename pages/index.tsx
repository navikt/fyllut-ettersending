import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GetServerSidePropsContext } from "next/types";

interface HomeProps {
  enheter: any[];
}

const Home: NextPage<HomeProps> = (props) => {
  const { enheter } = props
  return (
    <div className={styles.container}>
      <Head>
        <title>FyllUt - Ettersending</title>
        <meta name="description" content="Ettersending av vedlegg" />
        <link rel="icon" href="/home/akgagnat/Projects/fyllut-ettersending/public/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hallo ettersending!
        </h1>

        <div>Tester integrasjon mot FyllUt med <a href="https://doc.nais.io/clusters/service-discovery/">Kubernetes Service Discovery</a>: {enheter.length} enheter hentet</div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req, res } = context

  console.log("Server: params", params, process.env.FYLLUT_BASE_URL)
  // Følgende fetch må kjøres på server i gcp siden vi bruker Kubernetes service discovery
  // (dvs. FYLLUT_BASE_URL er en url som refererer til fylluts applikasjonsnavn i gcp)
  const data = await fetch(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`)
  const enheter = await data.json()
  console.log(`Server: fetched ${enheter.length} enheter...`)

  return {
    props: { enheter },
  }
}

export default Home
