import type { NextPage } from "next";
import "@navikt/ds-css";
import { Heading } from "@navikt/ds-react";

interface Props {

}

const UploadToMyPage: NextPage<Props> = (props) => {

  return (
    <>
      <Heading spacing size="large" level="2">
        Sende dokumentasjon i posten
      </Heading>
    </>
  );
};

export default UploadToMyPage;
