import { Box, Container, Grid, Stack } from '@mui/material';
import React from 'react';
import { config } from '../../strudel.config';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';
import { cleanPath } from '../utils/queryParams.utils';

/**
 * Bottom footer component
 */
export const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 4,
      }}
    >
      <Container>
        <Grid container>
          <Grid item md={6}>
            <Stack
              direction="row"
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {config.footer.links.map((link, i) => (
                <AppLink key={`${link.path}-${i}`} to={link.path}>
                  {link.label}
                </AppLink>
              ))}
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack alignItems="center">
              {config.footer.image && (
                <AppLink to="/">
                  <ImageWrapper height={60}>
                    <img
                      src={cleanPath(
                        `${import.meta.env.BASE_URL}/${config.footer.image}`
                      )}
                      alt="Footer logo"
                    />
                  </ImageWrapper>
                </AppLink>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
