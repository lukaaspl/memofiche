import { PROFILE_QUERY_KEY } from "consts/query-keys";
import { DetailedProfile } from "domains/user";
import { authApiClient } from "lib/axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

async function fetchProfile(): Promise<DetailedProfile> {
  const { data: profile } = await authApiClient.get<DetailedProfile>(
    "/profile"
  );

  return profile;
}

export default function useProfileQuery(
  options?: UseQueryOptions<DetailedProfile>
): UseQueryResult<DetailedProfile> {
  return useQuery(PROFILE_QUERY_KEY, fetchProfile, options);
}
