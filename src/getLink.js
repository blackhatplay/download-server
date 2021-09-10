const post = async (page, url, formData) => {
  let formHtml = "";

  Object.keys(formData).forEach(function (name) {
    value = formData[name];
    formHtml += `
        <input
          type='hidden'
          name='${name}'
          value='${value}'
        />
      `;
  });

  formHtml = `
      <form action='${url}' method='post'>
        ${formHtml}
  
        <input type='submit' />
      </form>
    `;

  await page.setContent(formHtml);
  const inputElement = await page.$("input[type=submit]");
  await inputElement.click();
};

module.exports = {
  post,
};
