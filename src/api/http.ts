const MimeType = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  PDF: 'application/pdf',
} as const;

type MimeType = (typeof MimeType)[keyof typeof MimeType];

type HttpHeaders = {
  'Content-Type'?: MimeType;
  Accept?: MimeType;
  Authorization?: string;
  [header: string]: string | string[] | undefined;
};

const getDefaultHeaders = (headers?: HttpHeaders) => {
  const defaultHeaders = {
    'Content-Type': MimeType.JSON,
    Accept: MimeType.JSON,
  };

  return { ...defaultHeaders, ...headers };
};

const get = async (url: string, headers?: HttpHeaders) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getDefaultHeaders(headers),
  });

  return handleResponse(response, url);
};

const post = async (
  url: string,
  body: BodyInit,
  headers?: HttpHeaders,
  returnResponse: boolean = false,
): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: getDefaultHeaders(headers),
    body,
  });

  if (returnResponse) return response;

  return handleResponse(response, url);
};

const handleResponse = (response: Response, url: string) => {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
};

export { get, post };
