import { useRouter } from 'next/router';
import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { Form, QuerySubmissionType } from '../../data';
import { Paths } from '../../data/paths';
import { buildQueryString, normalizeQueryValue } from '../../utils/queryParams';

interface Props {
  id: string;
  form: Form;
}

const ChooseFormSubmissionType = ({ id, form }: Props) => {
  const router = useRouter();
  const pathWithId = Paths.details(id);
  const tema = normalizeQueryValue(router.query.tema);
  const gjelder = normalizeQueryValue(router.query.gjelder);
  const digitalQuery = buildQueryString({
    sub: QuerySubmissionType.digital,
    tema,
    gjelder,
  });
  const paperQuery = buildQueryString({
    sub: QuerySubmissionType.paper,
    tema,
    gjelder,
  });
  return (
    <ChooseSubmissionType
      pathDigital={`${pathWithId}${digitalQuery ? `?${digitalQuery}` : ''}`}
      pathPaper={`${pathWithId}${paperQuery ? `?${paperQuery}` : ''}`}
      languages={form.properties.publishedLanguages}
    />
  );
};

export default ChooseFormSubmissionType;
