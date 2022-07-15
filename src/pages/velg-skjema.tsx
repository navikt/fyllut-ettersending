import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import "@navikt/ds-css";
import { Heading, Label, Radio, RadioGroup, Select, } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formDummy } from "../data/FormDummy";
import { getForms } from "../api/apiService";
import { Form } from "../api/domain";

interface Props {
  forms: Form[];
}

const VelgSkjema: NextPage<Props> = (props) => {
  const {forms} = props;
  const router = useRouter();
  const [submissionType, setSubmissionType] = useState("ettersende-vedlegg");
  const [showSearch, setShowSearch] = useState(false);
  const [showAttachmentsToSend, setShowAttachmentsToSend] = useState(false);

  useEffect(() => {
    switch (submissionType) {
      case "ettersende-vedlegg":
        setShowSearch(true);
        break;
      default:
        setShowSearch(false);
    }
  }, [submissionType]);

  return (
    <>
      <Heading spacing size="large" level="2">
        Sende dokumentasjon i posten
      </Heading>

      <RadioGroup
        legend="Hva gjelder innsendingen?"
        size="medium"
        onChange={(val: any) => setSubmissionType(val)}
        value={submissionType}
      >
        <Radio value="ettersende-vedlegg">Jeg skal ettersende vedlegg til en tidligere innsendt søknad</Radio>
        <Radio value="sende-annen-dok">Jeg skal sende annen dokumentasjon til NAV</Radio>
      </RadioGroup>

      {showSearch && (
        <>
          <Label spacing>Oppgi hvilken søknad du vil ettersende dokumentasjon til?</Label>

          <Select label="skjemanummersøk" size="medium">
            {formDummy.map((data, index) => (
              <option value={index} key={data.id}>{data.id + " " + data.navn}</option>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const forms = await getForms();

  return {
    props: {forms},
  };
}

export default VelgSkjema;
