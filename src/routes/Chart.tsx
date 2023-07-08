import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface ChartProps {
    coinId: string;
}

interface IHistorical {
    time_open: number;
    time_close: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    market_cap: number;
}

interface IToggleDark {}

function Chart(){
    const { coinId } = useOutletContext<ChartProps>();
    const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], ()=> fetchCoinHistory(coinId));
    const isDark = useRecoilValue(isDarkAtom);

    return <div>
        {isLoading? "Loading chart..." : 
        <ApexChart 
            type="line"
            series={[
                {
                    name: "Price",
                    data: data?.map((price) => Number(price.close)) ?? [],
                },
            ]}
            options={{
                theme: {
                    mode: isDark? "dark" : "light",
                },
                chart: {
                    height: 300,
                    width: 500,
                    toolbar: {
                        show: false,
                    },
                    background: "transparent",
                },
                stroke: {
                    curve: "smooth",
                    width: 4,
                },
                grid: {
                    show: false,
                },
                xaxis: {
                    labels: {
                        show: false,
                    },
                    axisTicks : {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    categories: data?.map((price) => new Date(price.time_close * 1000).toUTCString()),
                    type: "datetime",
                },
                yaxis: {
                    show: false,
                },
                fill: {
                    type: "gradient",
                    gradient: {gradientToColors: ["#0be881"], stops: [0, 100]},
                },
                colors: ["#0fbcf9"],
                tooltip: {
                    y: {
                        formatter: (value) => `$ ${value}`,
                    }
                }
            }}
        />}
    </div>;
}

export default Chart;