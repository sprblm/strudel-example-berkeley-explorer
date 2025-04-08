// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client';

export type Path =
  | `/`
  | `/about`
  | `/compare-data`
  | `/compare-data/compare`
  | `/compare-data/new`
  | `/contribute`
  | `/explore-data`
  | `/explore-data/:id`
  | `/home`
  | `/search-repositories`
  | `/search-repositories/:id`;

export type Params = {
  '/explore-data/:id': { id: string };
  '/search-repositories/:id': { id: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
