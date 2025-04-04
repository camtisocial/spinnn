export default class GithubInfo {
  constructor(data = {}) {
    this.followers = data.followers || 0;
    this.publicRepos = data.public_repos || 0;
    this.profilePage = data.html_url || '';
    this.avatarUrl = data.avatar_url || '';
    this.name = data.name || '';
    this.createdAt = data.created_at || '';
    this.updated_at = data.updated_at || '';
    this.username = data.login || '';
    this.htmlUrl = data.html_url || '';
    this.hireable = data.hireable || false;
    this.repos = data.repos_url || '';

  }
}

