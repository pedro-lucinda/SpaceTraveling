/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { FaCalendar, FaUser } from 'react-icons/fa';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: any;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <div className={styles.loadingContainer}>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <>
      <img className={styles.bannerImg} src={post.data.banner.url} alt="" />
      <div className={styles.postContainer}>
        <header>
          <h1>{post.data.title}</h1>
          <section>
            <time>
              <FaCalendar /> {post.first_publication_date}
            </time>
            <p>
              <FaUser /> {post.data.author}
            </p>
          </section>
        </header>
        <article>
          {post.data.content.map(content => (
            <>
              <h3>{content.heading}</h3>
              <article dangerouslySetInnerHTML={{ __html: content.body }} />
            </>
          ))}
        </article>
        <a onClick={() => router.push('/')} className={styles.goBackButton}>
          Go Back
        </a>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.slug'],
      pageSize: 20,
    }
  );

  const paths = posts.results.map(post => ({
    params: { uid: post.uid },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { uid } = context.params;

  const response = await prismic.getByUID('post', String(uid), {});

  const post = {
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(text => {
        return {
          heading: text.heading,
          body: RichText.asHtml(text.body),
        };
      }),
    },
  };

  return {
    props: { post },
    revalidate: 1,
  };
};
