import Observer from "../utils/observer";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          date: new Date(comment.date)
        }
    );
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          'date': comment.date.toISOString()
        }
    );
    return adaptedComment;
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update.comment
    ];

    this._notify(updateType, update.film);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.comment.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update.film);
  }
}
