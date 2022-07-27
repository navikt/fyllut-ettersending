import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useState } from "react";
import { NavUnit, UserData } from "../../api/domain";

interface Props {
  submissionType: string;
  radioGroupOnChange: any;
  userdata: UserData;
  userdataOnChange: any;
  socialno: string;
  socialnoOnChange: any;
  navUnits: NavUnit[];
}

const SubmissionRadioGroup = ({ submissionType, radioGroupOnChange, userdata, userdataOnChange, socialno, socialnoOnChange, navUnits}: Props) => {
  const [beenInContactWithNAV, setBeenInContactWithNAV] = useState("nei");

  return (
    <>
      <div className="section">
        <RadioGroup legend="Hvem gjelder innsendelsen for?" size="medium" onChange={radioGroupOnChange} value={submissionType}>
          <Radio value="har-fodselnr-eller-dnummer">En person som har fødselsnummer eller D-nummer</Radio>
          <Radio value="har-ikke-fodselnr-eller-dnummer">En person som ikke har fødselsnummer eller D-nummer</Radio>
          <Radio value="flere-personer-eller-annet">
            Flere personer samtidig eller tiltaksbedrifter, kursarrangører og andre virksomheter
          </Radio>
        </RadioGroup>
      </div>

      <div className="section">
        {submissionType === "flere-personer-eller-annet" && (
          <Select label="Velg hvilken NAV-enhet som skal motta innsendingen" size="medium">
            <option value="">NAV-enhet</option>
          </Select>
        )}
      </div>

      {submissionType === "har-fodselnr-eller-dnummer" && (
        <TextField
          value={socialno}
          name="socialNo"
          label="Fødselsnummer / D-nummer"
          onChange={socialnoOnChange}
          placeholder="Skriv inn tekst"
          size="medium"
        />
      )}

      {submissionType === "har-ikke-fodselnr-eller-dnummer" && (
        <>
          <div className="section">
            <TextField
              value={userdata.fornavn}
              name="fornavn"
              label="Fornavn"
              size="medium"
              onChange={userdataOnChange}
            />
            <TextField
              value={userdata.etternavn}
              name="etternavn"
              label="Etternavn"
              size="medium"
              onChange={userdataOnChange}
            />
            <TextField
              label="Gateadresse"
              value={userdata.gateAddresse}
              name="gateAddresse"
              onChange={userdataOnChange}
              size="medium"
            />
            <TextField
              label="Postnummer"
              value={userdata.postnr}
              name="postnr"
              onChange={userdataOnChange}
              size="medium"
            />
            <TextField
              label="Poststed"
              value={userdata.poststed}
              name="poststed"
              onChange={userdataOnChange}
              size="medium"
            />
            <TextField label="Land" value={userdata.land} name="land" onChange={userdataOnChange} size="medium" />
          </div>

          <RadioGroup
            legend="Har du vært i kontakt med NAV om denne saken tidligere?"
            size="medium"
            onChange={(val: string) => setBeenInContactWithNAV(val)}
            value={beenInContactWithNAV}
          >
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
          </RadioGroup>

          {console.log("insideChild navUnit", navUnits)}

          {beenInContactWithNAV === "ja" && (
            <Select label="Hvilken NAV-enhet har du vært i kontakt med?" size="medium">
              {navUnits.map(navUnit => (
                <option value="">{navUnit.name}</option>
              ))}
            </Select>
          )}
        </>
      )}
    </>
  );
};

export default SubmissionRadioGroup;
