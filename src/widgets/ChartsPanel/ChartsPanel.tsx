"use client"

import type { OrdersTrendPoint, ProductTypeDistributionPoint } from "@/app/api/database"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { formatShortDate } from "@/shared/lib"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions
} from "chart.js"
import { useMemo } from "react"
import { Bar, Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
)

interface ChartsPanelProps {
  locale: Locale
  ordersTrend: OrdersTrendPoint[]
  productTypeDistribution: ProductTypeDistributionPoint[]
}

const OrdersTrendChart = ({ locale, points }: { locale: Locale; points: OrdersTrendPoint[] }) => {
  const chartData = useMemo<ChartData<"line">>(
    () => ({
      labels: points.map((point) => formatShortDate(point.date, locale)),
      datasets: [
        {
          label: m.charts_orders_trend_title({}, { locale }),
          data: points.map((point) => point.count),
          borderColor: "rgb(13, 110, 253)",
          backgroundColor: "rgba(13, 110, 253, 0.14)",
          pointBackgroundColor: "rgb(13, 110, 253)",
          pointRadius: 3,
          pointHoverRadius: 4,
          borderWidth: 3,
          fill: true,
          tension: 0.28
        }
      ]
    }),
    [locale, points]
  )

  const chartOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }),
    []
  )

  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-3">
        <div>
          <h2 className="h6 mb-1">{m.charts_orders_trend_title({}, { locale })}</h2>
          <p className="small text-body-secondary mb-0">
            {m.charts_orders_trend_subtitle({}, { locale })}
          </p>
        </div>

        {points.length === 0 ? (
          <div className="alert alert-info mb-0">{m.charts_empty({}, { locale })}</div>
        ) : (
          <div style={{ height: 280 }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        )}
      </div>
    </article>
  )
}

const ProductTypesChart = ({
  locale,
  data
}: {
  locale: Locale
  data: ProductTypeDistributionPoint[]
}) => {
  const chartData = useMemo<ChartData<"bar">>(
    () => ({
      labels: data.map((item) =>
        item.type.length > 12 ? `${item.type.slice(0, 12)}...` : item.type
      ),
      datasets: [
        {
          label: m.charts_product_types_title({}, { locale }),
          data: data.map((item) => item.count),
          borderRadius: 8,
          backgroundColor: "rgba(25, 135, 84, 0.72)",
          hoverBackgroundColor: "rgba(25, 135, 84, 0.85)"
        }
      ]
    }),
    [data, locale]
  )

  const chartOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }),
    []
  )

  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-3">
        <div>
          <h2 className="h6 mb-1">{m.charts_product_types_title({}, { locale })}</h2>
          <p className="small text-body-secondary mb-0">
            {m.charts_product_types_subtitle({}, { locale })}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="alert alert-info mb-0">{m.charts_empty({}, { locale })}</div>
        ) : (
          <div style={{ height: 280 }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        )}
      </div>
    </article>
  )
}

const ChartsPanel = ({ locale, ordersTrend, productTypeDistribution }: ChartsPanelProps) => {
  return (
    <section className="row g-3">
      <div className="col-12 col-xxl-7">
        <OrdersTrendChart locale={locale} points={ordersTrend} />
      </div>
      <div className="col-12 col-xxl-5">
        <ProductTypesChart locale={locale} data={productTypeDistribution} />
      </div>
    </section>
  )
}

export { ChartsPanel }
