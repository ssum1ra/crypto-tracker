import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinTickers } from "../api";
import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
`;
const AthPrice = styled.div``;
const Prices = styled.div``;


interface PriceProps {
    coinId: string;
}

interface ITickers {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        }
    }
}

function Price() {
    const { coinId } = useOutletContext<PriceProps>();
    const { isLoading, data } = useQuery<ITickers[]>(["price", coinId], ()=> fetchCoinTickers(coinId));
    const coinData: ITickers | undefined = data?.find((coin) => coin.id === coinId);
    return <div>
        { isLoading? "Loading chart..." :
            <Wrapper>
                <AthPrice>
                    <div>{coinData?.quotes.USD.ath_price}</div>
                </AthPrice>
            </Wrapper>
        }
    </div>;
}

export default Price;