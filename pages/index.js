import styles from '../styles/page.module.css'
import Form from '../components/form/form'
import Posts from '../components/posts'
import { Noto_Nastaliq_Urdu } from '@next/font/google'
import Head from 'next/head'

const arabic = Noto_Nastaliq_Urdu({ weight: '400', subsets: ['arabic'] })

export default function Home () {
  return (
    <div>
      <Head>
        <title>Butterfly | Ishq | Haveli</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta
          property='og:image'
          content='https://butterfly.winterdelta.com/api/og'
        />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.mantra}>
            <div className={styles.mantraOutline}>
              <div className={styles.mantraUrdu}>
                <div className={arabic.className}>عشق</div>
              </div>
              <div className={styles.mantraEnglish}>HAVELI</div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.form}>
              <Form />
            </div>
            <div className={styles.posts}>
              <Posts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
