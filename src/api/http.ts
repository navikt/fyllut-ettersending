const SubmissionMethodType = {
  DIGITAL: "digital",
  PAPER: "paper",
} as const;

const MimeType = {
  JSON: "application/json",
  TEXT: "text/plain",
  PDF: "application/pdf",
} as const;

type MimeType = (typeof MimeType)[keyof typeof MimeType];

type HttpHeaders = {
  "Content-Type"?: MimeType;
  Accept?: MimeType;
  Authorization?: string;
  sub: string;
  [header: string]: string | string[] | undefined;
};

class UnauthenticatedError extends Error {}

const getDefaultHeaders = (headers?: HttpHeaders) => {
  const submissionMethod = headers?.["sub"]?.toUpperCase();

  const defaultHeaders = {
    "Content-Type": MimeType.JSON,
    Accept: MimeType.JSON,
  };

  if (submissionMethod && submissionMethod in SubmissionMethodType) {
    return {
      ...defaultHeaders,
      "Ettersendelse-Submission-Method": SubmissionMethodType[submissionMethod as keyof typeof SubmissionMethodType],
    };
  }
  return { ...defaultHeaders };
};

const get = async (url: string, headers?: HttpHeaders) => {
  const response = await fetch(url, {
    method: "GET",
    headers: getDefaultHeaders(headers),
  });

  return handleResponse(response, url);
};

const post = async (url: string, body: BodyInit, headers?: HttpHeaders) => {
  const response = await fetch(url, {
    method: "POST",
    headers: getDefaultHeaders(headers),
    body,
  });

  return handleResponse(response, url);
};

const handleResponse = (response: Response, url: string) => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthenticatedError(response.statusText);
    }

    throw new Error(`${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
};

export { get, post };
