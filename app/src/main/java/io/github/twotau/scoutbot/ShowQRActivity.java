package io.github.twotau.scoutbot;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

public class ShowQRActivity extends AppCompatActivity {

    public String getEncodedText(String teamNumber, String allianceColor, String defenseA, String defenseB, String defenseC, String defenseD, String highGoals, String lowGoals, String shootingRating, String specialty, String driverRating, String scaling, String overallRating) {

        while(teamNumber.length() < 5) {
            teamNumber = "0" + teamNumber;
        }

        allianceColor = (allianceColor.equals("Red")) ? "R" : "B";

        defenseA = (defenseA.equals("Portcullis")) ? "0" : "1";
        defenseB = (defenseB.equals("Ramparts")) ? "0" : "1";
        defenseC = (defenseC.equals("Drawbridge")) ? "0" : "1";
        defenseD = (defenseD.equals("Rock Wall")) ? "0" : "1";

        if(specialty.equals("Shooting")) {
            specialty = "0";
        } else if(specialty.equals("Crossing Defenses")) {
            specialty = "1";
        } else {
            specialty = "2";
        }

        if(highGoals.length() < 2) {
            highGoals = "0" + highGoals;
        }
        if(lowGoals.length() < 2) {
            lowGoals = "0" + lowGoals;
        }

        scaling = (scaling.equals("true")) ? "1" : "0";

        shootingRating = convertRating(shootingRating);
        driverRating =  convertRating(driverRating);
        overallRating =  convertRating(overallRating);

        return teamNumber + allianceColor + defenseA + defenseB + defenseC + defenseD + highGoals + lowGoals + shootingRating + specialty + driverRating + scaling + overallRating;
    }

    private String convertRating(String doubleRating) {
        return (!doubleRating.equals("5.0")) ? String.format("%d", (int) (Double.parseDouble(doubleRating) * 2)) : "A";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_qr);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        Intent intent = getIntent();

        String teamNumber = intent.getStringExtra(MainActivity.TEAM_NUMBER);
        String allianceColor = intent.getStringExtra(MainActivity.ALLIANCE_COLOR);
        String defenseA = intent.getStringExtra(MainActivity.DEFENSE_A);
        String defenseB = intent.getStringExtra(MainActivity.DEFENSE_B);
        String defenseC = intent.getStringExtra(MainActivity.DEFENSE_C);
        String defenseD = intent.getStringExtra(MainActivity.DEFENSE_D);
        String highGoals = intent.getStringExtra(MainActivity.HIGH_GOALS);
        String lowGoals = intent.getStringExtra(MainActivity.LOW_GOALS);
        String shootingRating = intent.getStringExtra(MainActivity.SHOOTING_RATING);
        String specialty = intent.getStringExtra(MainActivity.SPECIALTY);
        String driverRating = intent.getStringExtra(MainActivity.DRIVER_RATING);
        String scaling = intent.getStringExtra(MainActivity.SCALING);
        String overallRating = intent.getStringExtra(MainActivity.OVERALL_RATING);

        String encodedText = getEncodedText(teamNumber, allianceColor, defenseA, defenseB, defenseC, defenseD, highGoals, lowGoals, shootingRating, specialty, driverRating, scaling, overallRating);

        TextView encodedTextView = (TextView) findViewById(R.id.encodedText);
        encodedTextView.setText("Encoded text: \n" + encodedText);

        Intent qrDroid = new Intent("la.droid.qr.encode");
        qrDroid.putExtra("la.droid.qr.size", 1000);
        qrDroid.putExtra("la.droid.qr.code", encodedText);
        qrDroid.putExtra("la.droid.qr.image" , true);
        startActivityForResult(qrDroid, 0);
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        ImageView imgResult = (ImageView) findViewById(R.id.imageResult);
        String qrCode = data.getExtras().getString("la.droid.qr.result");
        imgResult.setImageURI( Uri.parse(qrCode));
        imgResult.setVisibility( View.VISIBLE );
    }

}
