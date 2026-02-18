import { useRouter } from 'next/router';
import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { Form, QuerySubmissionType } from '../../data';
import { Paths } from '../../data/paths';
import { mergeQueryString, normalizeQueryValue } from '../../utils/queryParams';

interface Props {
  id: string;
  form: Form;
}

const ChooseFormSubmissionType = ({ id, form }: Props) => {
  const router = useRouter();
  const pathWithId = Paths.details(id);
  const { tema, gjelder } = router.query as { tema?: string | string[]; gjelder?: string | string[] };
  const queryParams = { tema: normalizeQueryValue(tema), gjelder: normalizeQueryValue(gjelder) };
  return (
    <ChooseSubmissionType
      pathDigital={mergeQueryString(`${pathWithId}?sub=${QuerySubmissionType.digital}`, queryParams)}
      pathPaper={mergeQueryString(`${pathWithId}?sub=${QuerySubmissionType.paper}`, queryParams)}
      languages={form.properties.publishedLanguages}
    />
  );
};

export default ChooseFormSubmissionType;
