import "@navikt/ds-css";
import { Button, Checkbox, CheckboxGroup, Detail, Heading, TextField } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useEffect, useState } from "react";
import { getForm, getNavUnits } from "../api/apiService";
import { Form, NavUnit, UserData } from "../api/domain";
import SubmissionRadioGroup from "../components/submission/submissionRadioGroup";

interface Props {
  form: Form;
  navUnits: NavUnit[];
}

const Detaljer: NextPage<Props> = (props) => {
  const { form, navUnits } = props;
  const router = useRouter();
  //const { id } = router.query;
  const [attachmentType, setAttachmentType] = useState<string[]>([]);
  const [showAnotherAttachmentType, setShowAnotherAttachmentType] = useState(false);
  const [submissionInvolves, setSubmissionInvolves] = useState("");
  const [socialno, setSocialNo] = useState("");
  const [userdata, setUserData] = useState<UserData>({
    fornavn: "Ola",
    etternavn: "Nordmann",
    postnr: "0001",
    poststed: "Oslo",
    gateAddresse: "Addresse 1",
    land: "Norway",
  });

  const handleRadioGroupChange = (event: any) => {
    setSubmissionInvolves(event);
  };

  const handleSocialNoOnChange = (event: any) => {
    setSocialNo(event.target.value);
  };

  useEffect(() => {
    if (attachmentType.includes("annen-dok")) {
      setShowAnotherAttachmentType(true);
    } else {
      setShowAnotherAttachmentType(false);
    }
  }, [attachmentType]);


  const handleCheckBoxChange = (value: string) => {
    console.log("value", value);
  };

  const handleUserDataInputChange = (evt: any) => {
    const target = evt.target as HTMLInputElement;
    setUserData({
      ...userdata,
      [target.name]: target.value,
    });
  };

  return (
    <>
      <Heading spacing size="large" level="2">
        Sende dokumentasjon i posten
      </Heading>

      <div className="section">
        <Heading level="1" size="small">
          {form.title}
        </Heading>
        <Detail spacing>{form.properties.formNumber}</Detail>
      </div>

      <div className="section">
        <CheckboxGroup
          legend="Hvilke vedlegg skal du ettersende?"
          onChange={(val: string[]) => setAttachmentType(val)}
          size="medium"
        >
          {form.attachments.map(attachment => (
            <Checkbox key={attachment.key} value={attachment.label}>{attachment.label}</Checkbox>
          ))}
        </CheckboxGroup>
      </div>

      {showAnotherAttachmentType && (
        <TextField
          label="Hvilken annen dokumentasjon skal du sende?"
          value={userdata.postnr}
          name="postnr"
          size="medium"
        />
      )}

      <SubmissionRadioGroup
        submissionType={submissionInvolves}
        radioGroupOnChange={handleRadioGroupChange}
        userdata={userdata}
        userdataOnChange={handleUserDataInputChange}
        socialno={socialno}
        socialnoOnChange={handleSocialNoOnChange}
        navUnits={navUnits}
      />

      <div className="button-group">
        <Button variant="primary" onClick={() => router.push("#")} size="medium">
          Neste
        </Button>

        <Button variant="secondary" onClick={() => console.log("Userdata", userdata)} size="medium">
          Avbryt
        </Button>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const form = await getForm("nav952020");
  const navUnits = await getNavUnits();
  console.log("form", form);
  console.log("navUnits", navUnits);

  return {
    props: { form, navUnits },
  };
}

export default Detaljer;
