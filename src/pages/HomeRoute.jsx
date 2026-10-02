import CmsStatus from 'components/cms/CmsStatus';
import useCmsContent from 'utils/useCmsContent.js';
import HomePage from './home.jsx';

const isHomeContent = (content) => Object.hasOwn(content, 'hero')
  && (content.hero === null || Array.isArray(content.hero?.slides));

export default function HomeRoute() {
  const { status, content, retry } = useCmsContent('home', isHomeContent);
  if (status === 'ready') return <HomePage content={content} />;
  return <CmsStatus status={status} onRetry={retry} />;
}
