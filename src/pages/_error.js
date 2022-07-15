import { Heading } from "@navikt/ds-react";

const Error = ({ statusCode }) => {
  return (
    <>
      <Heading spacing size="large" level="2">
        Feilmelding
      </Heading>
      {
        statusCode === 404 ? (
          <p>Denne siden eksisterer ikke</p>
        ) : (
          <p>En feil har oppstått. Vennligst prøv igjen senere</p>
        )
      }
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error