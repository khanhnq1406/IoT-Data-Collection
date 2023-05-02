const PageNotFound = () => {
  return (
    <body className="error-page">
      <div id="error-page">
        <div class="content">
          <h2 class="header" data-text="404">
            404
          </h2>
          <h4 data-text="Opps! Page not found">Opps! Page not found</h4>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          <div class="btns">
            <a href="/">return home</a>
          </div>
        </div>
      </div>
    </body>
  );
};

export default PageNotFound;
