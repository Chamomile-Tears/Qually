(async () => {
  let re = new RegExp('form-do-groom','g');
	let res = await $.ajax ({
		type: "POST",
    url: window.location.origin + "/elevage/chevaux/doGroom",
    data: $('#form-do-groom').serialize().replace(re, '').toLowerCase()
	});
})();
