package io.github.twotau.scoutbot;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RatingBar;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    public final static String TEAM_NUMBER = "io.github.twotau.scoutbot.TEAM_NUMBER";
    public final static String ALLIANCE_COLOR = "io.github.twotau.scoutbot.ALLIANCE_COLOR";

    public final static String DEFENSE_A = "io.github.twotau.scoutbot.DEFENSE_A";
    public final static String DEFENSE_B = "io.github.twotau.scoutbot.DEFENSE_B";
    public final static String DEFENSE_C = "io.github.twotau.scoutbot.DEFENSE_C";
    public final static String DEFENSE_D = "io.github.twotau.scoutbot.DEFENSE_D";

    public final static String HIGH_GOALS = "io.github.twotau.scoutbot.HIGH_GOALS";
    public final static String LOW_GOALS = "io.github.twotau.scoutbot.LOW_GOALS";
    public final static String SHOOTING_RATING = "io.github.twotau.scoutbot.SHOOTING_RATING";

    public final static String SPECIALTY = "io.github.twotau.scoutbot.SPECIALTY";

    public final static String DRIVER_RATING = "io.github.twotau.scoutbot.DRIVER_RATING";

    public final static String SCALING = "io.github.twotau.scoutbot.SCALING";

    public final static String OVERALL_RATING = "io.github.twotau.scoutbot.OVERALL_RATING";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    /* When user clicks `Make QR Code` button */
    public void makeQR(View view) {

        EditText teamNumberInput = (EditText) findViewById(R.id.teamNumberInput);
        String teamNumber = teamNumberInput.getText().toString();
        if(TextUtils.isEmpty(teamNumber)) { showIncompleteToast("team number"); return; }

        RadioGroup allianceColorGroup = (RadioGroup) findViewById(R.id.allianceColorInput);
        RadioButton allianceColorSelected = (RadioButton) findViewById(allianceColorGroup.getCheckedRadioButtonId());
        if(allianceColorSelected == null) { showIncompleteToast("alliance color"); return; }
        String allianceColor = allianceColorSelected.getText().toString();

        RadioGroup defenseAGroup = (RadioGroup) findViewById(R.id.defenseA);
        RadioButton defenseASelected = (RadioButton) findViewById(defenseAGroup.getCheckedRadioButtonId());
        if(defenseASelected == null) { showIncompleteToast("defense A"); return; }
        String defenseA = defenseASelected.getText().toString();

        RadioGroup defenseBGroup = (RadioGroup) findViewById(R.id.defenseB);
        RadioButton defenseBSelected = (RadioButton) findViewById(defenseBGroup.getCheckedRadioButtonId());
        if(defenseBSelected == null) { showIncompleteToast("defense B"); return; }
        String defenseB = defenseBSelected.getText().toString();

        RadioGroup defenseCGroup = (RadioGroup) findViewById(R.id.defenseC);
        RadioButton defenseCSelected = (RadioButton) findViewById(defenseCGroup.getCheckedRadioButtonId());
        if(defenseCSelected == null) { showIncompleteToast("defense C"); return; }
        String defenseC = defenseCSelected.getText().toString();

        RadioGroup defenseDGroup = (RadioGroup) findViewById(R.id.defenseD);
        RadioButton defenseDSelected = (RadioButton) findViewById(defenseDGroup.getCheckedRadioButtonId());
        if(defenseDSelected == null) { showIncompleteToast("defense D"); return; }
        String defenseD = defenseDSelected.getText().toString();

        EditText highGoalsInput = (EditText) findViewById(R.id.highGoalsInput);
        String highGoals = highGoalsInput.getText().toString();
        if(TextUtils.isEmpty(highGoals)) { showIncompleteToast("high goals"); return; }

        EditText lowGoalsInput = (EditText) findViewById(R.id.lowGoalsInput);
        String lowGoals = lowGoalsInput.getText().toString();
        if(TextUtils.isEmpty(lowGoals)) { showIncompleteToast("low goals"); return; }

        RatingBar shootingRatingInput = (RatingBar) findViewById(R.id.shootingRatingInput);
        float shootingRating = shootingRatingInput.getRating();
        String shootingRatingStr = String.valueOf(shootingRating);

        RadioGroup specialtyGroup = (RadioGroup) findViewById(R.id.specialtyGroup);
        RadioButton specialtySelected = (RadioButton) findViewById(specialtyGroup.getCheckedRadioButtonId());
        if(specialtySelected == null) { showIncompleteToast("specialty"); return; }
        String specialty = specialtySelected.getText().toString();

        RatingBar drivingRatingInput = (RatingBar) findViewById(R.id.drivingRatingInput);
        float drivingRating = drivingRatingInput.getRating();
        String drivingRatingStr = String.valueOf(drivingRating);

        CheckBox successfulInput = (CheckBox) findViewById(R.id.successfulInput);
        boolean successfulScaling = successfulInput.isChecked();
        String successfulScalingStr = Boolean.toString(successfulScaling);

        RatingBar overallRatingInput = (RatingBar) findViewById(R.id.overallRatingInput);
        float overallRating = overallRatingInput.getRating();
        String overallRatingStr = String.valueOf(overallRating);

        Intent intent = new Intent(this, ShowQRActivity.class);
        intent.putExtra(TEAM_NUMBER, teamNumber);
        intent.putExtra(ALLIANCE_COLOR, allianceColor);
        intent.putExtra(DEFENSE_A, defenseA);
        intent.putExtra(DEFENSE_B, defenseB);
        intent.putExtra(DEFENSE_C, defenseC);
        intent.putExtra(DEFENSE_D, defenseD);
        intent.putExtra(HIGH_GOALS, highGoals);
        intent.putExtra(LOW_GOALS, lowGoals);
        intent.putExtra(SHOOTING_RATING, shootingRatingStr);
        intent.putExtra(SPECIALTY, specialty);
        intent.putExtra(DRIVER_RATING, drivingRatingStr);
        intent.putExtra(SCALING, successfulScalingStr);
        intent.putExtra(OVERALL_RATING, overallRatingStr);
        startActivity(intent);
    }

    public void showIncompleteToast(String incompleteField) {
        Toast.makeText(getApplicationContext(), "Fill out the " + incompleteField + " field.", Toast.LENGTH_SHORT).show();
    }

    public void addHighGoal(View view) {
        EditText goalsInput = (EditText) findViewById(R.id.highGoalsInput);
        int goals = Integer.parseInt(goalsInput.getText().toString());
        goalsInput.setText(String.valueOf(goals + 1));
    }

    public void minusHighGoal(View view) {
        EditText goalsInput = (EditText) findViewById(R.id.highGoalsInput);
        int goals = Integer.parseInt(goalsInput.getText().toString());
        if(goals != 0) { // don't let goals be negative
            goalsInput.setText(String.valueOf(goals - 1));
        }
    }

    public void addLowGoal(View view) {
        EditText goalsInput = (EditText) findViewById(R.id.lowGoalsInput);
        int goals = Integer.parseInt(goalsInput.getText().toString());
        goalsInput.setText(String.valueOf(goals + 1));
    }

    public void minusLowGoal(View view) {
        EditText goalsInput = (EditText) findViewById(R.id.lowGoalsInput);
        int goals = Integer.parseInt(goalsInput.getText().toString());
        if(goals != 0) { // don't let goals be negative
            goalsInput.setText(String.valueOf(goals - 1));
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
