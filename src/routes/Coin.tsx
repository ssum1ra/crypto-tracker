import { useParams, useLocation } from "react-router";
import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { Outlet, Link, useMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { AiFillHome } from 'react-icons/ai';


const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${props=>props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: ${props=>props.theme.blockColor};
    padding: 10px 20px;
    border-radius: 10px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    background-color: ${props=>props.theme.blockColor};
    border-radius: 10px;
    margin: 20px 0px;
    h1 {
        font-weight: 1000;
    }
`;

interface RouteState {
    state: {
        name: string;
    }
}

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transfrom: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: ${props=>props.theme.blockColor};
    padding: 7px 0px;
    border-radius: 10px;
    color: ${props => props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
    }
`;

const Home = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.textColor}
`;

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface PriceData {
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
    };
}

function Coin() {
    const { coinId } = useParams();
    const { state } = useLocation() as RouteState;
    const priceMatch = useMatch("/:coinId/price");
    const chartMatch = useMatch("/:coinId/chart");
    const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId!));
    const {isLoading: tickersLoading, data: tickersData} = useQuery<PriceData>(["tickers", coinId], () => fetchCoinTickers(coinId!), /*{refetchInterval: 5000}*/);
    /* const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [price, setPrice] = useState<PriceData>();
    
    useEffect(()=>{
        (async ()=> {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
       
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();

            setInfo(infoData);
            setPrice(priceData);
            setLoading(false);
        })();
    },[]); */
    const loading = infoLoading || tickersLoading;
    return (
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading? "Loadling..." : infoData?.name}</title>
            </Helmet>
            <Header>
                <Title>
                    {state?.name ? state.name : loading? "Loading..." : infoData?.name}
                </Title>
            </Header>
            {loading ? <Loader>Loading...</Loader> 
            : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol:</span>
                            <span>{infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price:</span>
                            <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>
                        <h1>Description</h1> <br/>
                        <p>{infoData?.description}</p>
                    </Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Suply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Suply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                        <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    
                    <Outlet context={{coinId}}/>

                    <Home>
                        <Link to={"/"}><AiFillHome size="20" /></Link>
                    </Home>
                </>
            )}
        </Container>
    );
}
export default Coin;
