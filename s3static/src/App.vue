<template>
  <b-container id="app" fluid class="mt-3">
    <b-row>
      <b-col>
        <h2>はじめに</h2>
        <div class="ml-3">
          <p>
            本ページは一市民が
            <a href="https://www.gyoukaku.go.jp/hotline/index.html">
              政府の行政改革
            </a>
            で公開されているエクセル情報を加工したものです。公式の情報は
            <a href="https://www.gyoukaku.go.jp/index.html">
              内閣官房行政改革推進本部事務局のウェブページ
            </a>
            を御覧ください。
          </p>
          <p>
            Github:
            <a href="https://github.com/Chachay/JPGov-Meyasubako-2020">
              Chachay/JPGov-Meyasubako-2020
            </a>
            にてコードを公開しております。
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card-group deck>
          <b-card title="更新情報">
            <b-card-sub-title class="mb-2">政府情報更新日</b-card-sub-title>
            <b-card-text class="mx-3">2021/11/10</b-card-text>
            <b-card-sub-title class="mb-2">サイト情報更新日</b-card-sub-title>
            <b-card-text class="mx-3">2021/11/15</b-card-text>

            <b-card-sub-title class="mb-2">目安箱投稿数</b-card-sub-title>
            <b-card-text class="mx-3">&gt;8000</b-card-text>
            <b-row>
              <b-col cols="4">
                <b-card-sub-title class="mb-2">検討要請数</b-card-sub-title>
                <b-card-text class="mx-3">{{ arrObj.length }}</b-card-text>
              </b-col>
              <b-col cols="4">
                <b-card-sub-title class="mb-2">回答数</b-card-sub-title>
                <b-card-text class="mx-3">
                  {{ answered }}
                </b-card-text>
              </b-col>
              <b-col cols="4">
                <b-card-sub-title class="mb-2">進捗</b-card-sub-title>
                <apexchart
                  width="80px"
                  height="80px"
                  :options="sparkline0"
                  :series="p_answered"
                ></apexchart>
              </b-col>
            </b-row>
          </b-card>

          <b-card title="集計">
            <apexchart
              height="400px"
              :options="chart01"
              :series="ministory"
            ></apexchart>
          </b-card>

          <b-card title="活動状況">
            <apexchart
              height="400px"
              :options="chart02"
              :series="activity"
            ></apexchart>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-1">
        <h2>データ</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="7" class="my-1">
        <b-form-group
          label="検索(提案主体, 提案事項, 所管省庁, タグ)"
          label-cols-sm="4"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              debounce="100"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :limit="navSize"
      aria-controls="ProjTable"
    ></b-pagination>
    <b-table
      id="ProjTable"
      striped
      hover
      small
      responsive
      fixed
      stacked="md"
      :filter="filter"
      :filter-included-fields="filterOn"
      :items="arrObj"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template #table-colgroup="scope">
        <col
          v-for="field in scope.fields"
          :key="field.key"
          :style="{ width: field.width || '3em' }"
        />
      </template>
      <template #cell(詳細)="row">
        <b-button size="sm" class="mr-2" @click="row.toggleDetails">
          詳細を{{ row.detailsShowing ? 'とじる' : 'ひらく' }}
        </b-button>
      </template>
      <template #cell(所管省庁)="data">
        <span v-html="data.value"></span>
      </template>
      <template #cell(所管省庁の検討結果_対応の分類)="data">
        <span v-html="data.value"></span>
      </template>
      <template #cell(タグ)="data">
        <span
          v-for="el in data.value.split('\n')"
          :key="el"
          class="badge badge-secondary mr-1"
          >{{ el }}</span
        >
      </template>
      <template #row-details="row">
        <b-card-group v-if="list_index.includes(row.item['UID'])" deck>
          <b-card title="提案内容">
            <b-card-sub-title class="mb-2">詳細</b-card-sub-title>
            <b-card-text
              class="ml-2"
              v-html="arrObjDetailed[row.item['UID']]['提案の具体的内容']"
            ></b-card-text>

            <b-card-sub-title class="mb-2">理由</b-card-sub-title>
            <b-card-text
              class="ml-2"
              v-html="arrObjDetailed[row.item['UID']]['提案理由']"
            ></b-card-text>
          </b-card>
          <b-card title="回答">
            <b-card-sub-title class="mb-2">現行制度</b-card-sub-title>
            <b-card-text
              class="ml-2"
              v-html="
                arrObjDetailed[row.item['UID']]['所管省庁の検討結果_制度の現状']
              "
            ></b-card-text>

            <b-card-sub-title class="mb-2">対応概要</b-card-sub-title>
            <b-card-text
              class="ml-2"
              v-html="
                arrObjDetailed[row.item['UID']]['所管省庁の検討結果_対応の概要']
              "
            ></b-card-text>

            <b-card-sub-title class="mb-2">該当法令</b-card-sub-title>
            <b-card-text
              class="ml-2"
              v-html="
                arrObjDetailed[row.item['UID']]['所管省庁の検討結果_該当法令等']
              "
            ></b-card-text>
          </b-card>
        </b-card-group>
        <b-card-group v-else deck>
          <b-card title="提案内容">
            <b-card-sub-title class="mb-2">詳細</b-card-sub-title>
            <b-card-text class="ml-2">未公開</b-card-text>

            <b-card-sub-title class="mb-2">理由</b-card-sub-title>
            <b-card-text class="ml-2">未公開</b-card-text>
          </b-card>
          <b-card title="回答">
            <b-card-sub-title class="mb-2">現行制度</b-card-sub-title>
            <b-card-text class="ml-2">回答なし</b-card-text>

            <b-card-sub-title class="mb-2">対応概要</b-card-sub-title>
            <b-card-text class="ml-2">回答なし</b-card-text>

            <b-card-sub-title class="mb-2">該当法令</b-card-sub-title>
            <b-card-text class="ml-2">回答なし</b-card-text>
          </b-card>
        </b-card-group>
        <b-button size="sm" class="my-2" @click="row.toggleDetails"
          >詳細をとじる</b-button
        >
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :limit="navSize"
      aria-controls="ProjTable"
    ></b-pagination>
    <b-row class="mt-4">
      <b-col>
        <p>
          本ページの情報は
          <a href="https://www.gyoukaku.go.jp/riyoukiyaku/riyoukiyaku.pdf"
            >内閣官房行政改革推進本部事務局ホームページ 利用規約</a
          >に従って, 個人が作成しております
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import rawdata from '@/assets/data_processed.json'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      JSON_PATH: 'data/data_processed.json',
      arrObj: rawdata,
      arrObjDetailed: {},
      perPage: 100,
      currentPage: 1,
      totalRows: 1,
      navSize: 10,

      tableFields: [
        { key: '通番', label: '番号', sortable: true, width: '2em' },
        { key: '区分', sortable: true, width: '2em' },
        {
          key: '所管省庁への検討要請日',
          label: '検討要請日',
          sortable: true,
          width: '2.5em',
        },
        {
          key: '回答取りまとめ日',
          label: '回答日',
          sortable: true,
          width: '2.5em',
        },
        { key: '提案主体', sortable: true, width: '3em' },
        { key: '提案事項', sortable: true, width: '8em' },
        { key: '所管省庁', sortable: true, width: '3em' },
        { key: 'タグ', sortable: true, width: '3em' },
        { key: '所管省庁の検討結果_対応の分類', label: '対応', width: '5em' },
        '詳細',
      ],
      stat: {},
      timeseries: {},
      filter: null,
      filterOn: ['通番', '提案主体', '所管省庁', '提案事項', 'タグ'],

      sparkline0: {
        chart: {
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          colors: ['#00A4CCFF'],
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: '50%',
            },
            track: {
              margin: 0,
            },
            dataLabels: {
              show: false,
            },
          },
        },
      },

      chart01: {
        chart: {
          type: 'bar',
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#444'],
        },
        title: {
          text: '各省庁の対応状況',
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        fill: {
          colors: ['#00A4CCFF', '#606060FF'],
          opacity: 1,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40,
          markers: {
            fillColors: [],
          },
        },
      },
      chart02: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: '件',
          },
        },
        fill: {
          colors: ['#00A4CCFF', '#F95700FF'],
          opacity: 1,
        },
        legend: {
          markers: {
            fillColors: [],
          },
        },
      },
    }
  },
  computed: {
    rows() {
      return this.arrObj.length
    },
    answered: function () {
      return this.arrObj.length - this.stat['未回答数']
    },
    p_answered: function () {
      return [
        ((this.arrObj.length - this.stat['未回答数']) * 100) /
          this.arrObj.length,
      ]
    },
    ministory: function () {
      const keys = this.chart01.xaxis.categories
      return [
        {
          name: '回答済',
          data: keys.map(
            (k) =>
              this.stat['省庁件数'][k] - (this.stat['省庁未回答件数'][k] || 0)
          ),
        },
        {
          name: '未回答',
          data: keys.map((k) => this.stat['省庁未回答件数'][k] || 0),
        },
      ]
    },
    activity: function () {
      const keys = this.chart02.xaxis.categories
      return [
        {
          name: '要請日',
          data: keys.map((k) => this.timeseries['要請日'][k] || 0),
        },
        {
          name: '回答日',
          data: keys.map((k) => this.timeseries['回答日'][k] || 0),
        },
      ]
    },
    list_index: function () {
      return Object.keys(this.arrObjDetailed)
    },
  },
  created() {
    this.chart01.legend.markers.fillColors = this.chart01.fill.colors
    this.chart02.legend.markers.fillColors = this.chart02.fill.colors

    this.axios.get(this.JSON_PATH).then((response) => {
      this.arrObjDetailed = response.data

      Object.keys(this.arrObjDetailed).forEach((k) => {
        const r = this.arrObjDetailed[k]
        r['提案の具体的内容'] = (r['提案の具体的内容'] || '未公開')
          .trim()
          .replaceAll('\n', '<br>')
        r['提案理由'] = (r['提案理由'] || '未公開')
          .trim()
          .replaceAll('\n', '<br>')
        r['所管省庁の検討結果_制度の現状'] = (
          r['所管省庁の検討結果_制度の現状'] || '回答なし'
        )
          .trim()
          .replaceAll('\n', '<br>')
        r['所管省庁の検討結果_対応の概要'] = (
          r['所管省庁の検討結果_対応の概要'] || '回答なし'
        )
          .trim()
          .replaceAll('\n', '<br>')
        r['所管省庁の検討結果_該当法令等'] = (
          r['所管省庁の検討結果_該当法令等'] || '回答なし'
        )
          .trim()
          .replaceAll('\n', '<br>')
      })
    })

    this.stat = this.arrObj.reduce(
      (a, c) => {
        a['未回答数'] += c['所管省庁の検討結果_対応の分類'] === null ? 1 : 0
        const m = c['所管省庁'].trim().split('\n')
        m.forEach((e) => {
          a['省庁件数'][e] = 1 + (a['省庁件数'][e] || 0)
          if (c['所管省庁の検討結果_対応の分類'] === null) {
            a['省庁未回答件数'][e] = 1 + (a['省庁未回答件数'][e] || 0)
          }
        })
        return a
      },
      { 未回答数: 0, 省庁件数: {}, 省庁未回答件数: {} }
    )
    this.chart01.xaxis.categories = Object.keys(this.stat['省庁件数'])
    this.chart01.xaxis.categories.sort(
      (a, b) => -this.stat['省庁件数'][a] + this.stat['省庁件数'][b]
    )

    this.arrObj.forEach((r) => {
      r['回答取りまとめ日'] = this.convertDate(r['回答取りまとめ日'])
      if (
        r['所管省庁への検討要請日'] === null &&
        r['回答取りまとめ日'] !== '未対応'
      ) {
        r['所管省庁への検討要請日'] = r['回答取りまとめ日']
      } else {
        r['所管省庁への検討要請日'] = this.convertDate(
          r['所管省庁への検討要請日']
        )
      }
      r['所管省庁'] = r['所管省庁'].replaceAll('\n', '<br>')
      r['所管省庁の検討結果_対応の分類'] = (
        r['所管省庁の検討結果_対応の分類'] || '未対応'
      ).replaceAll('\n', '<br>')
    })

    this.timeseries = this.arrObj.reduce(
      (a, c) => {
        const label0 = c['所管省庁への検討要請日'].substr(0, 4 + 1 + 2)
        const label1 = c['回答取りまとめ日'].substr(0, 4 + 1 + 2)
        a['要請日'][label0] = 1 + (a['要請日'][label0] || 0)
        a['回答日'][label1] = 1 + (a['回答日'][label1] || 0)

        return a
      },
      { 要請日: {}, 回答日: {} }
    )
    this.chart02.xaxis.categories = [
      ...new Set(
        Object.keys(this.timeseries['要請日']).concat(
          Object.keys(this.timeseries['回答日'])
        )
      ),
    ]
    this.chart02.xaxis.categories.sort()
    this.chart02.xaxis.categories = this.chart02.xaxis.categories.slice(0, -1)
  },
  mounted() {
    this.totalRows = this.arrObj.length
  },
  methods: {
    convertDate(unixTime) {
      if (unixTime !== null) {
        return new Date(unixTime).toISOString().split('T')[0]
      } else {
        return '未対応'
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<style>
@media (min-width: 576px) {
  .card-columns {
    column-count: 2;
  }
}
@media (min-width: 768px) {
  .card-columns {
    column-count: 3;
  }
}
@media (min-width: 992px) {
  .card-columns {
    column-count: 4;
  }
}
@media (min-width: 1200px) {
  .card-columns {
    column-count: 5;
  }
}
</style>
