import React, { Component, createRef } from "react";
import Paginate from "../_helper/paginate";
import PropTypes from "prop-types";
import {
  Grid,
  Header,
  Segment,
  Input,
  Table,
  Pagination,
  Select,
  Icon,
  Checkbox,
  Button,
  Label,
  Popup,
  Ref,
  Dropdown
} from "semantic-ui-react";
import { PageSize, DinamicList } from "../_helper/SelectList";
import _ from "lodash";
import Filtering from "../_helper/filtering";
import { AppContext } from "../AppProvider";

class MyTable extends Component {
  //#region STATIC & PROPTYPES
  static contextType = AppContext;
  createdRef = createRef();
  static propTypes = {
    searchBar: PropTypes.bool,
    orderBy: PropTypes.number,
    orderDirection: PropTypes.oneOf(["asc", "desc"]),
    selection: PropTypes.bool,
    onSelectedChange: PropTypes.func,
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    button: PropTypes.element
  };
  static defaultProps = {
    searchBar: false,
    orderDirection: "asc",
    selection: false,
    orderBy: 0,
    selectedRow: []
  };
  //#endregion

  state = {
    pageSize: 10,
    currentPage: 1,
    isLoading: false,
    orderBy: this.props.orderBy,
    orderDirection: this.props.orderDirection,
    filterValue: 0,
    searchValue: ""
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isLoading === true &&
      this.state.isLoading === nextState.isLoading
    ) {
      return false;
    }
    return true;
  }

  //#region PAGINATION
  handleSelectPageSize = (e, data) => {
    this.setState({ pageSize: data.value });
  };

  handlePageChange = (e, data) => {
    //clear selection before unmounting
    this.setState({ currentPage: data.activePage });
  };
  //#endregion

  changeValue = _.debounce(
    function(value) {
      this.setState({ searchValue: value, isLoading: false });
    },
    500,
    { trailing: true }
  );

  handleOnSearch = (e, data) => {
    e.persist();
    this.setState({ isLoading: true }, this.changeValue(data.value));
  };

  handleOnSearchClear = () => {
    this.createdRef.current.children[0].value = "";
    this.setState({ searchValue: "" });
  };

  handleSort = e => {
    try {
      if (e.target.nodeName === "TH" && e.target.attributes.name) {
        this.props.header.forEach((x, i) => {
          if (x.content === e.target.innerText) {
            const direction = x.className === "asc" ? "desc" : "asc";
            this.setState({ orderBy: i, orderDirection: direction });
          }
        });
      }
    } catch (error) {}
  };

  handleFilterChange = (e, data) => {
    console.log(data);
    this.setState({ filterValue: data.value });
  };

  //#region SELECTION
  handleSelectionOnChange = (data, checked) => {
    let selectedRow = [];
    if (checked) {
      selectedRow = [...this.props.selectedRow, data];
    } else {
      selectedRow = this.props.selectedRow.filter(x => !(x.id === data.id));
    }
    this.props.onSelectedChange && this.props.onSelectedChange(selectedRow);
  };

  handleClearSelection = () => {
    this.props.onSelectedChange && this.props.onSelectedChange([]);
  };
  //#endregion

  render() {
    //#region DESTRUCTURING
    const {
      data,
      title,
      button,
      searchBar,
      selection,
      body,
      header
    } = this.props;

    const {
      pageSize,
      currentPage,
      searchValue,
      orderBy,
      orderDirection,
      filterValue
    } = this.state;
    //#endregion

    const filterList = DinamicList(header, "name", x => x.content, true);

    //show order icon in header
    const headerWithOrder = header;
    headerWithOrder.forEach((x, i) => {
      if (orderBy === i) {
        x.className = orderDirection;
      } else {
        x.className = "";
      }
    });

    //header and body with checkbox
    const hr = [{ key: "cb-0", content: "" }, ...headerWithOrder];
    const br = (data, i) => ({
      ...this.props.body(data, i),
      cells: [
        {
          key: `cb-${i}`,
          width: 1,
          content: (
            <Checkbox
              toggle
              checked={_.find(this.props.selectedRow, data) ? true : false}
              onChange={(e, props) =>
                this.handleSelectionOnChange(data, props.checked)
              }
            />
          )
        },
        ...this.props.body(data, i).cells
      ],
      active: _.find(this.props.selectedRow, data) ? true : false
    });
    const renderFooter = [
      {
        key: "footer",
        as: "th",
        colSpan: headerWithOrder.length,
        content: (
          <React.Fragment>
            {this.props.selectedRow.length !== 0 && (
              <Button.Group onClick={this.handleClearSelection}>
                <Button as="div" labelPosition="left">
                  <Label basic color="red">
                    {this.props.selectedRow.length}
                  </Label>
                  <MyTable.Button label="Unselect" icon="erase" color="red" />
                </Button>
              </Button.Group>
            )}{" "}
            {button}
          </React.Fragment>
        ),
        textAlign: "left"
      }
    ];
    const footerWithCb = [
      {
        key: "footer-1",
        content: ""
      },
      ...renderFooter
    ];

    //render when no data in table
    const noData = [{ name: "No data available" }];
    const renderBodyRowEmpty = ({ name }, i) => ({
      key: i,
      cells: [
        {
          key: i,
          colSpan: selection ? header.length + 1 : header.length,
          content: name
        }
      ],
      textAlign: "center"
    });

    const orderFunction = (header, x) => {
      if (header.table) {
        return this.context.useRelation({
          db: header.table,
          key: x[header.name],
          value: header.value || "name"
        });
      } else {
        return x[header.name];
      }
    };
    const sortedData = _.orderBy(
      data,
      x => orderFunction(header[orderBy], x),
      orderDirection
    );
    //filtering with search
    const filteredData =
      Filtering(sortedData, body, searchValue, filterValue) || sortedData;
    //count length row per page
    const pageLength = Math.ceil(filteredData.length / pageSize);
    //check if current page greater than page size
    const cPage = currentPage > pageLength ? pageLength : currentPage;
    //Pagination
    const paginatedData = Paginate(filteredData, cPage, pageSize);

    //#region RENDER ELEMENT
    const search = searchBar && (
      <div>
        <Segment.Group horizontal>
          <Segment>
            <Ref innerRef={this.createdRef}>
              <Input
                icon={
                  <Icon
                    name={this.state.searchValue.length ? "x" : "search"}
                    inverted
                    color="blue"
                    circular
                    link
                    onClick={this.handleOnSearchClear}
                  />
                }
                loading={this.state.isLoading}
                placeholder="SEARCH"
                fluid
                onChange={this.handleOnSearch}
              />
            </Ref>
          </Segment>
          <Segment>
            <Dropdown
              button
              className="icon"
              fluid
              floating
              scrolling
              labeled
              onChange={this.handleFilterChange}
              icon="filter"
              value={filterValue}
              options={filterList}
            />
          </Segment>
        </Segment.Group>
      </div>
    );
    const table = (
      <Table
        celled
        sortable
        compact
        selectable
        definition={selection}
        onClick={this.handleSort}
        textAlign="center"
        headerRow={selection ? hr : headerWithOrder}
        renderBodyRow={
          paginatedData.length !== 0
            ? selection
              ? br
              : body
            : renderBodyRowEmpty
        }
        tableData={paginatedData.length !== 0 ? paginatedData : noData}
        footerRow={button && (selection ? footerWithCb : renderFooter)}
      />
    );
    const pageSizeSelector = (
      <Popup
        content="Select row size per table"
        position="top center"
        trigger={
          <Select
            style={{ marginRight: 10, verticalAlign: "middle" }}
            onChange={this.handleSelectPageSize}
            compact
            options={PageSize}
            defaultValue={pageSize}
          />
        }
      />
    );
    const pagination =
      pageLength <= 1 ? (
        ""
      ) : (
        <Pagination
          activePage={cPage}
          boundaryRange={2}
          onPageChange={this.handlePageChange}
          siblingRange={3}
          totalPages={pageLength}
        />
      );
    //#endregion

    return (
      <React.Fragment>
        <Grid textAlign="center">
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column>
              <Segment color="blue" inverted>
                <Header as="h1">{title} </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="right">
              {search}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center">{table}</Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid verticalAlign="middle" padded>
          <Grid.Column textAlign="center">
            {pageSizeSelector}
            {pagination}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

MyTable.Button = props => {
  return (
    <Button
      animated
      size="mini"
      action={props.action}
      color={props.color || "blue"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Button.Content visible>{props.label}</Button.Content>
      <Button.Content hidden>
        <Icon name={props.icon} />
      </Button.Content>
    </Button>
  );
};

export default MyTable;
