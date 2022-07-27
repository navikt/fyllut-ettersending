import "@navikt/ds-css";
import { BodyShort, Heading, Label, LinkPanel, Radio, RadioGroup, Search, Select } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { Form, KeyValue, UserData, userDataInit, NavUnit } from "../api/domain";
import SubmissionRadioGroup from "../components/submission/submissionRadioGroup";

interface Props {
  forms: Form[];
  temaer: KeyValue[];
  navUnits: NavUnit[];
}

const VelgSkjema: NextPage<Props> = (props) => {
  const { forms, temaer, navUnits } = props;
  const router = useRouter();
  const [submissionType, setSubmissionType] = useState("ettersende-vedlegg");
  const [submissionInvolves, setSubmissionInvolves] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Form[]>([]);
  const searchRef = useRef(null);
  const [socialno, setSocialNo] = useState("");
  const [userdata, setUserData] = useState<UserData>(userDataInit);

  useEffect(() => {
    const result = forms.filter((e) => e.title.includes(searchInput));
    setSearchResult(result);
  }, [searchInput]);

  const handleRadioGroupChange = (event: any) => {
    setSubmissionInvolves(event);
  };

  const handleSocialNoOnChange = (event: any) => {
    setSocialNo(event.target.value);
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
      <div className="section">
        <Heading spacing size="large" level="2">
          Sende dokumentasjon i posten
        </Heading>
      </div>

      <div className="section">
        <RadioGroup
          legend="Hva gjelder innsendingen?"
          size="medium"
          onChange={(val: any) => setSubmissionType(val)}
          value={submissionType}
        >
          <Radio value="ettersende-vedlegg">Jeg skal ettersende vedlegg til en tidligere innsendt søknad</Radio>
          <Radio value="sende-annen-dok">Jeg skal sende annen dokumentasjon til NAV</Radio>
        </RadioGroup>
      </div>

      <div className="section">
        <Label spacing>Hvilket skjema vil du ettersende dokumentasjon til?</Label>
        <BodyShort spacing>
          Søk på skjemanavn, skjemanummer eller stikkord. Velg søknad / skjema i søkeresultatet.
        </BodyShort>
      </div>

      {submissionType === "ettersende-vedlegg" && (
        <>
          <div className="section">
            <Search
              ref={searchRef}
              label="Søk"
              onChange={(e) => setSearchInput(e)}
              onClear={() => setSearchInput("")}
              size="medium"
              variant="secondary"
            />
          </div>

          <div className="application-results">
            {searchResult.map((form, index) => (
              <LinkPanel href={form._id} key={index} border>
                <LinkPanel.Title>{form.title}</LinkPanel.Title>
                <LinkPanel.Description>{form.path}</LinkPanel.Description>
              </LinkPanel>
            ))}
          </div>
        </>
      )}

      {submissionType === "sende-annen-dok" && (
        <>
          <div className="section">
            <Select label="Velg tema for innsendingen" size="medium">
              {Object?.keys(temaer)?.map((tema) => (
                <option value={tema}>{temaer[tema]}</option>
              ))}
              <option value="tema">tema</option>
            </Select>
          </div>

          <SubmissionRadioGroup
            submissionType={submissionInvolves}
            radioGroupOnChange={handleRadioGroupChange}
            userdata={userdata}
            userdataOnChange={handleUserDataInputChange}
            socialno={socialno}
            socialnoOnChange={handleSocialNoOnChange}
            navUnits={navUnits}
          />
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const forms = await getForms();
  const temaer = await getArchiveSubjects();
  const navUnits = await getNavUnits();
  console.log("form", forms);
  console.log("temaer", temaer);
  console.log("navUnits", navUnits);

  return {
    props: { forms, temaer, navUnits },
  };
}

export default VelgSkjema;
