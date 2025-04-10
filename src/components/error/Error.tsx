import { BugIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, Link, List, VStack } from '@navikt/ds-react';

type ErrorProps = {
  heading: string;
  errorBody: string; //Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.
  navigateToFrontPage: string; //Gå til forsiden
  ctaButton?: string; // Bruk gjerne søket eller menyen
  bugUrlTitle: string; //Meld gjerne fra om at lenken ikke virker
};

export function Error({ heading, bugUrlTitle, errorBody, navigateToFrontPage, ctaButton }: ErrorProps) {
  return (
    <Box paddingBlock="20">
      <VStack gap="16">
        <VStack gap="12" align="start">
          <div>
            <Heading level="2" size="large" spacing>
              {heading}
            </Heading>
            <BodyShort>{errorBody}</BodyShort>
            <List>
              <List.Item>{ctaButton}</List.Item>
              <List.Item>
                <Link href={process.env.NEXT_PUBLIC_NAV_URL || 'https://nav.no'}>{navigateToFrontPage}</Link>
              </List.Item>
            </List>
          </div>
          <Button as="a" href="https://www.nav.no/minside">
            Gå til min side
          </Button>
          <Link href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">
            <BugIcon aria-hidden />
            {bugUrlTitle}
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}
