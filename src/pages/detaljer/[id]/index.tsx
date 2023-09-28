import { GetStaticProps } from "next";

const PaperDetail = () => {
  return <></>;
};

export const getStaticProps: GetStaticProps = async () => {
  return { notFound: true };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export default PaperDetail;
