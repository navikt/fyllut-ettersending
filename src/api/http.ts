import { HttpError, UnauthenticatedError } from '../data/domain';

const MimeType = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  PDF: 'application/pdf',
} as const;

type MimeType = (typeof MimeType)[keyof typeof MimeType];

type HttpHeaders = {
  'Content-Type'?: string;
  Accept?: MimeType;
  Authorization?: string;
  [header: string]: string | string[] | undefined;
};

type HttpOptions = {
  rawResponse?: boolean;
};

const getDefaultHeaders = (headers?: HttpHeaders) => {
  const defaultHeaders = {
    'Content-Type': MimeType.JSON,
    Accept: MimeType.JSON,
  };

  return { ...defaultHeaders, ...headers };
};

const get = async <T>(url: string, headers?: HttpHeaders): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getDefaultHeaders({ 'Content-Type': 'application/json; charset=utf8', ...headers }),
  });

  return await handleResponse(response);
};

const post = async <T>(url: string, body: object, headers?: HttpHeaders, opts?: HttpOptions): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: getDefaultHeaders(headers),
    body: JSON.stringify(body),
  });

  return await handleResponse(response, opts?.rawResponse);
};

const handleResponse = async (response: Response, rawResponse: boolean = false) => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthenticatedError(response.statusText);
    }

    let errorMessage;
    if (isResponseType(response, MimeType.JSON)) {
      const responseJson = await response.json();
      if (responseJson.message) {
        errorMessage = responseJson.message;
      }
    } else if (isResponseType(response, MimeType.TEXT)) {
      errorMessage = await response.text();
    }

    throw new HttpError(errorMessage || response.statusText, response.status);
  }

  if (rawResponse) {
    return response;
  } else if (isResponseType(response, MimeType.JSON)) {
    return response.json();
  } else if (isResponseType(response, MimeType.TEXT)) {
    return await response.text();
  } else if (isResponseType(response, MimeType.PDF)) {
    return await response.blob();
  } else {
    return response;
  }
};

const isResponseType = (response: Response, mimeType: MimeType) => {
  const contentType = response.headers.get('Content-Type');
  return contentType && contentType.includes(mimeType);
};

export { get, post };
