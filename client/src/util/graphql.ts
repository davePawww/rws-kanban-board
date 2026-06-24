import { parse, print, type DocumentNode } from 'graphql';

const endpoint = '/graphql';

export function gql(strings: TemplateStringsArray, ...values: string[]): DocumentNode {
  return parse(strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), ''));
}

export async function request<TData, TVars extends Record<string, unknown> | undefined = undefined>(
  document: DocumentNode,
  variables?: TVars,
): Promise<TData> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: print(document), variables }),
  });
  const json: unknown = await res.json();
  if (typeof json !== 'object' || json === null) throw new Error('Invalid response');
  const { errors, data } = json as { errors?: Array<{ message: string }>; data?: TData };
  if (errors) throw new Error(errors[0].message);
  return data as TData;
}
