/**
 * Created by roiyarden on 3/26/15.
 */
var sparkPrintPrep = function() {

	return {
		/**
		 * Upload file via Spark drive (usually a 3D format type as stl,obj),then the mesh is being imported.
		 * @param files - files to be uploaded
		 * @param events - map of events to support the ajax async call
		 */
			uploadFileAndImport: function (files,mainCallback) {
				var token = spark.auth.isAccessTokenValid();
				if (token) {
					var callback = function(filesResp){
						if (filesResp.files != undefined && filesResp.files.length > 0) {

							sparkPrintPrep.importMesh(filesResp.files[0].file_id, filesResp.files[0].name,mainCallback);

						}
						else {
							console.log('An upload error occurred!');
						}

					};
					spark.drive.uploadFileToDrive(files,false,callback);
				}


			},
		/**
		 * Importing the Mesh from the file on Spark drive creating a mesh on print servers.
		 * @param fileId - spark drive file id
		 * @param fileName - spark drive file name
		 * @param events - map of events to support the ajax async call
		 */
		importMesh: function (fileId, fileName,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + spark.auth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/geom/meshes/import';

					var params = "file_id=" + fileId + "&name=" + fileName + "&generate_visual=true";


					spark.util.xhr(url, 'POST', params, headers, function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					});
				}




		},
		/**
		 * Get the task and perform the needed logic for all the available tasks
		 * @param taskId
		 * @param taskType
		 * @param events - map of events to support the ajax async call
		 */
		getTask: function (taskId,mainCallback) {
			var token = spark.auth.isAccessTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + spark.auth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/print/tasks/' + taskId;


					var callback = function (response) {
						if (response.status === spark.const.RUNNING_TASK_STATUS ){
							setTimeout(function() {
								sparkPrintPrep.getTask(taskId, mainCallback);
								return;
							}, 500);

						}
						else if (response.status === spark.const.ERROR_TASK_STATUS){
							console.log('Operation Failed: Error code:'+response.error.code);
							return;

						}
						else{
							mainCallback(response.result);
						}
					};

					spark.util.xhr(url, 'GET', '', headers, callback,undefined,undefined,undefined);
				}


		},
		/**
		 * analyze mesh to find problems.
		 * @param events - map of events to support the ajax async call
		 */
		analyzeMesh: function (meshId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + spark.auth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/geom/meshes/analyze';

					var params = "id=" + meshId;

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					};

					spark.util.xhr(url, 'POST', params, headers, callback,undefined,undefined,undefined);
				}



		},
		/**
		 * reapir mesh problems (actually does analyze and repair if not analyzed).
		 * @param events - map of events to support the ajax async call
		 */
		repairMesh: function (meshId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + spark.auth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/geom/meshes/repair';

					var params = "id=" + meshId + "&all=true";

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					};

					spark.util.xhr(url, 'POST', params, headers, callback,undefined,undefined,undefined);
				}



		},
		/**
		 * export the mesh to a desired file type
		 * @param events - map of events to support the ajax async call
		 */
		exportMesh: function (meshId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/geom/meshes/export';

				var params = "id=" + meshId + "&file_type=obj";

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, mainCallback);

				};

				spark.util.xhr(url, 'POST', params, headers, callback);
			}


		},

		/**
		 *
		 * @param fileId
		 */
		downloadFile: function(fileId, mainCallback){
			var token = spark.auth.isAccessTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/files/download?file_ids='+fileId;


				var callback = function (response) {
					mainCallback(response);

				};

				spark.util.xhr(url, 'GET', '', headers, callback,undefined,false);
			}

		},

		createTray: function (meshIds, printerTypeId, profileId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/json"
				};
				var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/print/trays';

				//var params = "id=" + mesh_id + "&file_type=obj";
				var params =  JSON.stringify({
					"printer_type_id": printerTypeId,
					"profile_id": profileId,
					"mesh_ids":[meshIds]
				});

				//var params="printer_type_id="+printerTypeId+"&profile_id="+profileId+"&meshIds=["+meshIds+"]";

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, mainCallback);

				};

				spark.util.xhr(url, 'POST', params, headers, callback);
			}


		},

		prepareTray: function (trayId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/print/trays/prepare';

				var params="id="+trayId;

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, mainCallback);

				};

				spark.util.xhr(url, 'POST', params, headers, callback);
			}

		},

		createSupport: function (trayId,mainCallback) {

			var token = spark.auth.isAccessTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/print/trays/exportSupport';

				var params="id="+trayId;

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, mainCallback);

				};

				spark.util.xhr(url, 'POST', params, headers, callback);
			}

		},

		generatePrintable: function(trayId,mainCallback) {

		var token = spark.auth.isAccessTokenValid();
		if (token) {
			var headers = {
				"Authorization": "Bearer " + spark.auth.accessToken(),
				"Content-type": "application/x-www-form-urlencoded"
			};

			var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/print/trays/generatePrintable';

			var params="id="+trayId;

			var callback = function (response) {

				sparkPrintPrep.getTask(response.id, mainCallback);

			};

			spark.util.xhr(url, 'POST', params, headers, callback);
		}

	}
	}


}();