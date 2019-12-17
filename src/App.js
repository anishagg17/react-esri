import React from 'react';
import axios from 'axios';
import './index.css';
import Chart from './Chart';
import Footer from './Footer';
const url = 'http://starlord.hackerearth.com/bankAccount';
// 'https://cors-anywhere.herokuapp.com/http://starlord.hackerearth.com/bankAccount';

// Account No: 409000611074
// Date: "29 Jun 17"
// Transaction Details: "TRF FROM  Indiaforensic SERVICES"
// Value Date: "29 Jun 17"
// Withdrawal AMT: ""
// Deposit AMT: "10,00,000.00"
// Balance AMT: "10,00,000.00"

function comp(a, b) {
  a = new Date(a.Date);
  b = new Date(b.Date);
  return a > b ? -1 : a < b ? 1 : 0;
}
class App extends React.Component {
  state = {
    data: [],
    page: 0,
    loading: true,
    error: false,
    Accno: null,
    query: '',
    queryData: [],
    queryPage: 0
  };
  changePage = (page, type = 'n') => {
    if (type === 'q') return this.setState({ queryPage: page });
    this.setState({ page });
  };
  getQueryData = x => {
    this.setState({ query: x });
    let queryData = [];
    let { data } = this.state;
    let query = x.toLowerCase();
    data.forEach((e, index) => {
      const Date = e.Date.toString().toLowerCase();
      const description = e['Transaction Details'].toString().toLowerCase();
      if (Date.search(query) !== -1 || description.search(query) !== -1) {
        const entry = (
          <tr
            ng-repeat="row in transactionList | filter: transType"
            key={index}
          >
            <td>{e.Date}</td>
            <td>{e['Transaction Details']}</td>
            <td>{e['Withdrawal AMT'] || '-'}</td>
            <td>{e['Deposit AMT'] || '-'}</td>
            <td>{e['Balance AMT']}</td>
          </tr>
        );
        queryData.push(entry);
      }
    });
    this.setState({ queryData });
  };

  render() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    let tbd = [];
    if (this.state.data !== []) {
      let data = this.state.data;

      if (this.state.query !== '') {
        // this.getQueryData();
        tbd = this.state.queryData.slice(
          10 * this.state.queryPage,
          Math.min(10 * (1 + this.state.queryPage), this.state.queryData.length)
        );
        // return;
      } else {
        data = data.slice(
          10 * this.state.page,
          Math.min(10 * (1 + this.state.page), data.length)
        );

        data.forEach((e, index) => {
          // console.log(e);
          const entry = (
            <tr key={index}>
              <td>{e.Date}</td>
              <td>{e['Transaction Details']}</td>
              <td>{e['Withdrawal AMT'] || '-'}</td>
              <td>{e['Deposit AMT'] || '-'}</td>
              <td>{e['Balance AMT']}</td>
            </tr>
          );

          tbd.push(entry);
          // return;
        });
      }
    }

    return (
      <div className="app">
        <h3 className="bank">HackerEarth Bank</h3>
        {this.state.Accno !== null ? (
          <div>
            <div className="inacc">
              <div className="acc">
                <span>Account Number : </span> {this.state.Accno}
              </div>
              <input
                className="in"
                placeholder="Search..."
                onChange={e => {
                  let x = e.target.value;
                  this.getQueryData(x.toString());
                  this.changePage(0, 'q');
                  this.changePage(0);
                  // console.log(this.state, '\nx=', x);
                }}
              />
            </div>
            <table className="table table-bordered ">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Withdrawal AMT</th>
                  <th>Deposit AMT</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>{tbd}</tbody>
            </table>
            {this.state.query === '' ? (
              <ul>
                {this.state.page !== 0 && (
                  <li onClick={() => this.changePage(this.state.page - 1)}>
                    Previous
                  </li>
                )}
                {this.state.page !== 0 && (
                  <li onClick={() => this.changePage(this.state.page - 1)}>
                    {this.state.page - 1}
                  </li>
                )}
                <li
                  className="activeli"
                  onClick={() => this.changePage(this.state.page)}
                >
                  {this.state.page}
                </li>
                {this.state.page + 1 < this.state.data.length / 10 && (
                  <li onClick={() => this.changePage(this.state.page + 1)}>
                    {this.state.page + 1}
                  </li>
                )}
                {this.state.page + 1 < this.state.data.length / 10 && (
                  <li onClick={() => this.changePage(this.state.page + 1)}>
                    Next
                  </li>
                )}
              </ul>
            ) : (
              //query Paginator
              <ul>
                {this.state.queryPage !== 0 && (
                  <li
                    onClick={() =>
                      this.changePage(this.state.queryPage - 1, 'q')
                    }
                  >
                    Previous
                  </li>
                )}
                {this.state.queryPage !== 0 && (
                  <li
                    onClick={() =>
                      this.changePage(this.state.queryPage - 1, 'q')
                    }
                  >
                    {this.state.queryPage - 1}
                  </li>
                )}
                <li
                  className="activeli"
                  onClick={() => this.changePage(this.state.queryPage)}
                >
                  {this.state.queryPage}
                </li>
                {this.state.queryPage + 1 <
                  this.state.queryData.length / 10 && (
                  <li
                    onClick={() =>
                      this.changePage(this.state.queryPage + 1, 'q')
                    }
                  >
                    {this.state.queryPage + 1}
                  </li>
                )}
                {this.state.queryPage + 1 <
                  this.state.queryData.length / 10 && (
                  <li
                    onClick={() =>
                      this.changePage(this.state.queryPage + 1, 'q')
                    }
                  >
                    Next
                  </li>
                )}
              </ul>
            )}
          </div>
        ) : null}
        <div className="chart">
          <Chart />
        </div>
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    axios
      .get('/bankAccount')
      .then(res => {
        let { data } = res;
        const srotedData = data.sort(comp);
        this.setState({
          data: srotedData,
          Accno: res.data[0]['Account No']
        });
        console.log(res);
      })
      .catch(err => {
        this.setState({
          error: err
        });
        // console.log(this.state);
      });
  }
}

export default App;
