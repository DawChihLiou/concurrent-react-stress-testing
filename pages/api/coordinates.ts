// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import cities from 'all-the-cities';

interface ReqBody {
  origin: string;
  destinations: Record<'id' | 'location', string>[];
}

interface Data {
  origin: number[];
  destinations: {
    id: string;
    coordinates: number[];
  }[];
}

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

const match = (location: string) => (city: ArrayElement<typeof cities>) => {
  const token = location.split(/[,*\s+]+/).join('|');
  const regex = new RegExp(token, 'ig');
  return city.name.match(regex);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }
  const { origin, destinations }: ReqBody = req.body;

  const org = cities
    .filter(match(origin))
    .filter((_, i) => i === 0)
    .map((c) => [...c.loc.coordinates].reverse())
    .flat();

  const dst = destinations.reduce((acc, loc) => {
    return [
      ...acc,
      ...cities
        .filter(match(loc.location))
        .filter((_, i) => i === 0) // take one
        .map((c) => ({
          id: loc.id,
          coordinates: [...c.loc.coordinates].reverse(),
        })),
    ];
  }, [] as Data['destinations']);

  res.status(200).json({
    origin: org.length === 0 ? [40.7128, 74.006] : org, // default to NYC
    destinations: dst,
  });
}
