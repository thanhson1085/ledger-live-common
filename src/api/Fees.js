// @flow
import invariant from "invariant";
import type { CryptoCurrency } from "../types";
import { FeeEstimationFailed } from "../errors";
import { makeLRUCache } from "../cache";
import { blockchainBaseURL } from "./Ledger";
import network from "../network";

export type Fees = {
  [_: string]: number
};

export const getEstimatedFees = makeLRUCache(
  async (currency: CryptoCurrency): Promise<Fees> => {
    const baseURL = blockchainBaseURL(currency);
    invariant(baseURL, `Fees for ${currency.id} are not supported`);
    const { data, status } = await network({
      method: "GET",
      url: `${baseURL}/fees`
    });
    if (data) {
      return data;
    }
    throw new FeeEstimationFailed(`FeeEstimationFailed ${status}`, {
      httpStatus: status
    });
  },
  c => c.id
);
