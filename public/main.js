var data = {
    "miasta": [
        {
            "nazwa": "A",
            "ma_jednostke": true
        },
        {
            "nazwa": "B",
            "ma_jednostke": true
        },
        {
            "nazwa": "C",
            "ma_jednostke": false
        },
        {
            "nazwa": "D",
            "ma_jednostke": false
        },
        {
            "nazwa": "E",
            "ma_jednostke": true
        }
    ],
    "drogi": [
        {
            "miasta": ["A", "B"],
            "czas_przejazdu": 2
        },
        {
            "miasta": ["A", "C"],
            "czas_przejazdu": 3
        },
        {
            "miasta": ["A", "D"],
            "czas_przejazdu": 4
        },
        {
            "miasta": ["A", "E"],
            "czas_przejazdu": 1
        }
    ],
    "max_czas_przejazdu": 10
};

$(document).ready(() => {
    const load = () => {

        jQuery.validator.setDefaults({
            showErrors: function (errorMap, errorList) {
            }
        });

        data.miasta.forEach((cityItem, cityIndex) => {

            let cityTemplate = createCityTemplate(cityIndex);

            $('.city-list').append(cityTemplate);

            data.drogi.forEach((roadItem, roadIndex) => {

                if (data.drogi[roadIndex].miasta.includes(data.miasta[cityIndex].nazwa)) {

                    let roadTemplate = createRoadTemplate(cityIndex, roadIndex);
                    $('#road-list_' + cityIndex).append(roadTemplate);
                }
            })
        });

        $('.add_city').click(() => {

            $('#city_form').validate();

            let repeats = data.miasta.filter((element) => {
                return element.nazwa === $('#city').val();
            })

            if (repeats.length === 0 && $('#city_form').valid()) {
                let newCity = {nazwa: $('#city').val(), ma_jednostke: $('#hasFs').is(':checked')}
                data.miasta.push(newCity);
                clear();
                load();
            } else {
                reset();
            }
        });

        $('.remove_city').click((event) => {
            console.log($(event.target).attr('data-index'));
            data.miasta.splice($(event.target).attr('data-index'), 1);
            clear();
            console.log(data);
            load();
        });

        $('.add_road').click(() => {
            $('#road_form').validate();

            let repeats = data.drogi.filter((element) => {
                return (element.miasta[0] === $('#city1').val() || element.miasta[0] === $('#city2').val()) &&
                    (element.miasta[1] === $('#city1').val() || element.miasta[1] === $('#city2').val());
            })

            if ((repeats.length === 0) && ($('#road_form').valid()) && ($('#city1').val() != $('#city2').val())) {
                let newRoad = {miasta: [$('#city1').val(), $('#city2').val()], czas_przejazdu: $('#time').val()};
                data.drogi.push(newRoad);
                clear();
                load();
            } else {
                reset();
            }
        });

        $('.add_maxTime').click(() => {
            $('#maxTime_form').validate();

            if ($('#maxTime_form').valid()) {
                data.max_czas_przejazdu = $('#maxTime').val();
                clear();
                load();
            } else {
                reset();
            }
        });

        $('#select').change(function () {
            $('.option_form').hide();
            $('#' + $(this).val()).show();
        });

        $('.show').click((event) => {
            $('#road-list_' + $(event.target).attr('data-index')).toggle();
        });

        $('#search').click(() => {
            let search_value = $('#search_input').val();

            if (($('#search_input').val().toLowerCase()) === 'sosnowiec') {
                $('#search_input').val('I,m afraid I can\'t search that, Dave.')
            } else {
                let cityNames = data.miasta.map((cityName) => {
                    return cityName.nazwa;
                });
                if (cityNames.includes(search_value)) {
                    let search = '#road-list_' + cityNames.indexOf(search_value);
                    console.log(search);
                    $(search).toggle();
                } else {
                    $('#search_input').val('Nie ma takiej pozycji na liście.')
                }
            }
        });
    }
    load();
});

let createCityTemplate = (cityIndex) => {
    let cityTemplate =
        `<tr class='city-list_element ${hasConnection(cityIndex)}' id='city_${cityIndex}'>
               <td><div class="city-list_field">${data.miasta[cityIndex].nazwa}</div></td>
               <td><div class="city-list_field">${data.miasta[cityIndex].ma_jednostke ? 'TAK' : 'NIE'}</div></td>
               <td><div class="city-list_field">${cntRoads(cityIndex)}</div></td>
               <td>
                  <button class="show pure-button city-list_element_buttons" data-index="${cityIndex}"><i class="fas fa-chevron-down fa-sm btn--event-none"></i> </button>
                  <button class="remove_city pure-button city-list_element_buttons" data-index="${cityIndex}"><i class="fas fa-trash-alt fa-sm btn--event-none"></i> </button>
               </td>
        </tr>
        <tr>
            <td colspan="4">
                <div class="road-list--background">
                    <table style="width: 100%" id="${'road-list_' + cityIndex}" class="road-list-container road-list-container--hidden">
                        <thead>
                            <tr>
                                <th class="road-list_head">Połączenie</th>
                                <th class="road-list_head">Straż pożarna?</th>
                                <th class="road-list_head">Czas przejazdu</th>
                                <th></th>
                            </tr>
                        </thead>    
                    </table>
                </div>
            </td>
        </tr>
        <tr class="city-list_element--spacer"></tr>`;
    return cityTemplate;
};

let createRoadTemplate = (cityIndex, roadIndex) => {
    let roadTemplate =
        `<tr class="road-list_element">
            <td class="road-list_field"><i class="fas fa-long-arrow-alt-right fa-sm"></i>${findRoadName(cityIndex, roadIndex)}</td>
            <td class="road-list_field">${hasFs(cityIndex, roadIndex) ? 'TAK' : 'NIE'}</td>
            <td class="road-list_field">${data.drogi[roadIndex].czas_przejazdu} min</td>
        </tr>`;
    return roadTemplate;
};

const clear = () => {
    $('.city-list_element').next().remove();
    $('.city-list_element').remove();
    $('.city-list_element--spacer').remove();
};

const reset = () => {
    $('input').val('');
};

let findRoadName = (cityIndex, roadIndex) => {

    if (data.miasta[cityIndex].nazwa === data.drogi[roadIndex].miasta[0]) {
        return data.drogi[roadIndex].miasta[1];
    } else {
        return data.drogi[roadIndex].miasta[0];
    }
};

let cntRoads = (cityIndex) => {

    let connections = data.drogi.filter((element) => {
        return (element.miasta[0] === data.miasta[cityIndex].nazwa || element.miasta[1] === data.miasta[cityIndex].nazwa);
    })

    return connections.length;
};

let hasFs = (cityIndex, roadIndex) => {
    let fireStation = data.miasta.filter((cityItem1, cityIndex1) => {

      return cityItem1.nazwa === findRoadName(cityIndex, roadIndex);
    })

    if ( fireStation[0] ) {
        return fireStation[0].ma_jednostke;
    } else {
        return false;
    };
};

let hasConnection = (cityIndex) => {
    let connections = data.drogi.filter((element) => {
        return (element.miasta[0] === data.miasta[cityIndex].nazwa && element.czas_przejazdu <= data.max_czas_przejazdu) || (element.miasta[1] === data.miasta[cityIndex].nazwa && element.czas_przejazdu <= data.max_czas_przejazdu);
    }).map((connectionItem) => {
        if (connectionItem.miasta[0] === data.miasta[cityIndex].nazwa) {
            return connectionItem.miasta[1];
        } else {
            return connectionItem.miasta[0];
        }
    });

    let final = data.miasta.filter((element) => {
        return element.ma_jednostke && connections.includes(element.nazwa);
    })

    if (data.miasta[cityIndex].ma_jednostke) {
        return 'city-list_element--green';
    } else if (final.length > 0) {
        return 'city-list_element--blue';
    } else {
        return 'city-list_element--red';
    }
};

