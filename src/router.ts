// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client';

export type Path =
  | `/`
  | `/about`
  | `/about/UrbanEnvironmentalHealth`
  | `/compare-data`
  | `/compare-data/compare`
  | `/compare-data/new`
  | `/contribute`
  | `/explore-data`
  | `/explore-data/:id`
  | `/home`
  | `/monitor`
  | `/monitor-activities`
  | `/monitor-activities/calendar`
  | `/monitor-activities/detail`
  | `/run-computation`
  | `/run-computation/:id/data-inputs`
  | `/run-computation/:id/results`
  | `/run-computation/:id/running`
  | `/run-computation/:id/settings`
  | `/run-computation/RunComputation`
  | `/search-repositories`
  | `/search-repositories/:id`;

export type Params = {
  '/explore-data/:id': { id: string };
  '/run-computation/:id/data-inputs': { id: string };
  '/run-computation/:id/results': { id: string };
  '/run-computation/:id/running': { id: string };
  '/run-computation/:id/settings': { id: string };
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
