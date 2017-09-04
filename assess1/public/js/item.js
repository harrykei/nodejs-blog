/**
 * http://usejsdoc.org/
 */
function createContent() {
	$.ajax({
		url: '/items',
		type: 'POST',
		data: $('#contentForm').serialize(),
		success: function(result) {
			if (result.success)
				window.location = '/b';
			else
				toastr.error(result.msg, 'Error!');
		}
	});
}

function deleteContent(itemId) {
	if (confirm('Are you sure you want to delete?')) {
		$.ajax({
			url: '/items/'+itemId,
			type: 'DELETE',
			success: function(result) {
				if (result.success)
					window.location = '/b';
				else
					toastr.error(result.msg, 'Error!');
			}
		});
	}
}