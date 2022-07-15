const get = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return handleResponse(response, url);
};

const handleResponse = (response: Response, url: string) => {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
}

export {
  get
}