import Model from "../models/Model";
import Pagination from "../models/Pagination";
import DB from "../db/DB";

interface PaginatorInterface {
  query: string;
  limit: number;
  offset: number;
}

export default class Paginator<T extends typeof Model> {
  private model: T;
  private query: string;
  private values: any[] = [];
  private totalQuery: string;
  private totalQueryValues: any[] = [];

  constructor(model: T) {
    this.model = model;
  }

  public setQuery(query: string, values?: any[]) {
    this.query = query;
    this.values = values ?? [];
    return this;
  }

  public setTotalQuery(query: string, values?: any[]) {
    this.totalQuery = query;
    this.totalQueryValues = values ?? [];
    return this;
  }

  public async create(options: PaginatorInterface = {
    query: "",
    limit: 20,
    offset: 0
  }): Promise<Pagination<InstanceType<T>>> {
    return Pagination.create(
      await this.getResults(options),
      await this.getTotal(options),
      options.limit,
      options.offset
    );
  }

  private async getResults({query, limit, offset}: PaginatorInterface): Promise<InstanceType<T>[]> {
    const i = this.values.length;
    const result = await DB.query(`
        ${this.query}
        LIMIT $${i + 2} OFFSET $${i + 3}
    `, [...this.values, `%${query}%`, limit, offset]);
    return result.rows.map(r => this.model.hydrate(r));
  }

  private async getTotal({query}: PaginatorInterface) {
    return parseInt((await DB.query(this.totalQuery, [...this.totalQueryValues, `%${query}%`])).rows[0]?.count);
  }
}
