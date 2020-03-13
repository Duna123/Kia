$(".btn-basic").click(function () {
    $(".btn-basic").addClass("active");
    $(".btn-plus").removeClass("active");
    $("#cars-details-container").hide();
    $("#cars-list-container").show();
    $(".buttons").attr("data-package", 1);
    retreiveCarsFromCategoryURL("https://kiacare.gwcworld.com/api/configure?package_id=1");
});

$(".btn-plus").click(function () {
    $(".btn-plus").addClass("active");
    $(".btn-basic").removeClass("active");
    $("#cars-details-container").hide();
    $("#cars-list-container").show();
    $(".buttons").attr("data-package", 2);
    retreiveCarsFromCategoryURL("https://kiacare.gwcworld.com/api/configure?package_id=2");
});

function buildCarPreviewHtml(value) {
    return "<div class='car-item' data-car-id='" + value.id + "' data-image='" + value.image + "'><div class='car-image'><img src='" + value.image + "'></div><div class='car-title'><h3>" + value.title + "</h3></div></div>";
}

$(".cars-component").on("click", ".car-item", function () {
    $(this).addClass("active");
    var packageID = $(".buttons").attr("data-package");
    $("#cars-list-container").hide();
    //change image, dropdowns
    $("img[data-details-image]").attr("src", $(this).attr('data-image'));
    populateEngineDropdown(packageID, $(this).attr('data-car-id'));
    $("#cars-details-container").show();
});


$(".cars-component").on("change", "#engineSelectBox", function () {
    var packageID = $(".buttons").attr("data-package");
    var carID = $(".car-item.active").attr("data-car-id");
    var url = "https://kiacare.gwcworld.com/api/configure?package_id=" + packageID + "&car_id=" + carID + "&engine_id=" + $(this).val();
    var $guaranteeDropdown = $("#guaranteeSelectBox");
    var result = [];
    $("#price").text("");
    $.ajax(url,
        {
            dataType: 'json',
            timeout: 50000000,
            success: function (data, status, xhr) {
                $guaranteeDropdown.empty();
                $.each(data, function () {
                    $guaranteeDropdown.append($("<option />").val(this.id).text(this.title));
                })
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback
                console.log("handle error");
            }
        });
});


$(".cars-component").on("change", "#guaranteeSelectBox", function () {
    var packageID = $(".buttons").attr("data-package");
    var carID = $(".car-item.active").attr("data-car-id");
    var engineID = $("#engineSelectBox").val();

    var url = "https://kiacare.gwcworld.com/api/configure?package_id=" + packageID + "&car_id=" + carID + "&engine_id=" + engineID + "&guarantee_id=" + $(this).val();
    var $guaranteeDropdown = $("#guaranteeSelectBox");
    var result = [];
    $.ajax(url,
        {
            dataType: 'json',
            timeout: 50000000,
            success: function (data, status, xhr) {
                $("#price").text(data.price);
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback
                console.log("handle error");
            }
        });
});

function populateEngineDropdown(package, id) {
    var url = "https://kiacare.gwcworld.com/api/configure?package_id=" + package + "&car_id=" + id;
    var $engineDropdown = $("#engineSelectBox");
    var result = [];
    $.ajax(url,
        {
            dataType: 'json',
            timeout: 50000000,
            success: function (data, status, xhr) {
                $engineDropdown.empty();
                $.each(data, function () {
                    $engineDropdown.append($("<option />").val(this.id).text(this.title));
                })
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback
                console.log("handle error");
            }
        });
}


function retreiveCarsFromCategoryURL(url) {
    $.get(url, function (data, status) {
        var kiaBasic = [];
        $.each(data, function (index, value) {
            kiaBasic.push((buildCarPreviewHtml(value)));
        });
        $("#cars-list-container").empty().append(kiaBasic);
    });
}

$(document).ready(function () {
    retreiveCarsFromCategoryURL("https://kiacare.gwcworld.com/api/configure?package_id=1");
});