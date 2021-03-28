import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | Blog</title>
      </Head>
      <main className={styles.homeContainer}>
        {postsPagination.results.map(post => (
          <section key={post.uid} className={styles.post}>
            <Link href={`/post/${post.uid}`}>
              <h1>{post.data.title}</h1>
            </Link>

            <div>
              <p>
                <FaRegCalendar />
                {new Date(post.first_publication_date).toLocaleDateString(
                  'en-US',
                  {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </p>
              <p>
                <FaRegUser />
                {post.data.author}
              </p>
            </div>
            <p>{post.data.subtitle}</p>
          </section>
        ))}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: [
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.content',
      ],
      pageSize: 20,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: 'link',
    results: posts,
  };

  return {
    props: { postsPagination },
    revalidate: 60 * 60 * 24,
  };
};
