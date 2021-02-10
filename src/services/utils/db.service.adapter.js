class DbServiceAdapter {
  constructor(model) {
    this.Model = model;
  }

  async create(payload) {
    const document = new this.Model(payload);
    await document.save();
    return document;
  }

  async find(id) {
    const document = await this.Model.findById(id);
    return document;
  }

  async update(id, patch) {
    const options = {
      new: true,
    };
    const document = await this.Model.findOneAndUpdate(
      { _id: id },
      patch,
      options
    );
    return document;
  }

  async list(filter) {
    const documents = await this.Model.find(filter);
    return documents;
  }
}

export default DbServiceAdapter;
