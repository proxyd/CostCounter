var storage = [];

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var item = storage[e.target.getAttribute('aria-controls')];
    if (item !== undefined) {
        $("#nextCount").val(item[0]);
        $("#prevCount").val(item[1]);
    } else {
        $("#nextCount").val(0);
        $("#prevCount").val(0);
    }
});

$('input, a[data-toggle="tab"]').on("keyup click change", function () {
    var next = parseInt($("#nextCount").val()) || 0;
    var prev = parseInt($("#prevCount").val()) || 0;
    var id = $(".active > a").attr("aria-controls");

    storage[id] = [next, prev];

    var amount = (function () {
        if (next < prev) {
            next += Math.pow(10, parseInt(prev.toString().length));
        }
        return next - prev;
    })();

    var tariffs = (function (arr) {
        var today = new Date();
        var result = [];
        arr.forEach(function (item) {
            var startDate = new Date(item.startDate);
            var endDate = new Date(item.endDate);
            if (today >= startDate && today <= endDate) {
                result = item.tariffs;
            }
        });
        return result;
    })(config[id]);

    var cost = (function (t, amount) {
        var cost = 0;
        t.forEach(function (item) {
            if (amount > item.limit) {
                cost += (amount - item.limit) * item.price;
                amount = item.limit;
            }
        });
        return cost.toFixed(2);
    })(tariffs, amount);
    
    var costSuffix = $('#' + id + ' h1 small');
    costSuffix.detach();
    $('#' + id + ' h1').text(cost + ' ').append(costSuffix);

    var amountSuffix = $('#' + id + ' h2 small');
    amountSuffix.detach();
    $('#' + id + ' h2').text(amount + ' ').append(amountSuffix);
});
