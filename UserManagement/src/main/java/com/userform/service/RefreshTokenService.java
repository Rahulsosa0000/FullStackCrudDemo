package com.userform.service;

import com.userform.model.UserToken;
import com.userform.repo.UserTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Autowired
    private UserTokenRepository userTokenRepository;

    // ✅ Save or Update User Token in DB
    public void saveUserToken(Long userId, String accessToken, String refreshToken, LocalDateTime expiryTime) {
        UserToken userToken = new UserToken();
        userToken.setUserId(userId);
        userToken.setAccessToken(accessToken);
        userToken.setRefreshToken(refreshToken);
        userToken.setExpiryTime(expiryTime);

        userTokenRepository.save(userToken);
    }

    // ✅ Find by Refresh Token
    public Optional<UserToken> findByRefreshToken(String refreshToken) {
        return userTokenRepository.findByRefreshToken(refreshToken);
    }

    // ✅ Delete Token on Logout
    public void deleteTokenByUserId(Long userId) {
        userTokenRepository.deleteByUserId(userId);
    }
}
