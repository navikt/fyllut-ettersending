import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { Form, QuerySubmissionType } from '../../data';
import { Paths } from '../../data/paths';

interface Props {
  id: string;
  form: Form;
}

const ChooseFormSubmissionType = ({ id, form }: Props) => {
  const pathWithId = Paths.details(id);
  return (
    <ChooseSubmissionType
      pathDigital={`${pathWithId}?sub=${QuerySubmissionType.digital}`}
      pathPaper={`${pathWithId}?sub=${QuerySubmissionType.paper}`}
      languages={form.properties.publishedLanguages}
    />
  );
};

export default ChooseFormSubmissionType;
