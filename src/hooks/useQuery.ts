import queryString from "query-string";
import { useLocation } from "react-router-dom";

export default function useQuery() {
  const q = queryString.parse(useLocation().search);

  let query: { [key: string]: string | undefined } = {};
  for (const key in q) {
    if (Array.isArray(q[key])) {
      query[key] = (q[key] as Array<string>).join(",");
    } else {
      query[key] = (q[key] || undefined) as string | undefined;
    }
  }
  return query;
}
