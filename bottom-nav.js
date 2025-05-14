const bottomNavHTML = `
  <nav class="bottom-nav">
    <a href="#" class="active">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="post.html">
      <i class="fas fa-bullhorn"></i>
      <span>Posts</span>
    </a>
    <a href="refer.html">
      <i class="fas fa-wallet"></i>
      <span>Refer</span>
    </a>
    <a href="profile.html">
      <i class="fas fa-user"></i>
      <span>Profile</span>
    </a>
  </nav>
`;

document.body.insertAdjacentHTML('beforeend', bottomNavHTML);

// Highlight active link
document.querySelectorAll('.bottom-nav a').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.bottom-nav a').forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
  });
});

let lastScrollY = window.scrollY;
const bottomNav = document.querySelector('.bottom-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    bottomNav.classList.add('hide');
  } else {
    bottomNav.classList.remove('hide');
  }
  lastScrollY = window.scrollY;
});