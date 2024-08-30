import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { Form, SubmissionType } from '../../data/domain';
import { Paths } from '../../data/paths';

interface Props {
  id: string;
  form: Form;
}

const ChooseFormSubmissionType = ({ id, form }: Props) => {
  const pathWithId = Paths.details(id);
  return (
    <ChooseSubmissionType
      pathDigital={`${pathWithId}?sub=${SubmissionType.digital}`}
      pathPaper={`${pathWithId}?sub=${SubmissionType.paper}`}
      languages={form.properties.publishedLanguages}
    />
  );
};

export default ChooseFormSubmissionType;
